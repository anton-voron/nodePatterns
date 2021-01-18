const http = require('http');
const path = require('path');
const fs = require('fs');
require('./schema').load();
const api = require('./api');
const { join } = require('path');
api.load();


const httpError = (res, status, message) => {
    res.statusCode = status;
    res.end(`"${message}"`);
};

const receiveArgs = async req => new Promise(resolve => {
    const body = [];
    req.on('data', chunk => {
        body.push(chunk);
    }).on('end', async () => {
        const data = body.join('');
        const args = JSON.parse(data);
        resolve(args);
    });
});

const server = http.createServer(async (req, res) => {
    const url = req.url === '/' ? '/index.html' : req.url;
    const [first, second] = url.substring(1).split('/');

    if (first === 'api') {

        const method = api.get(second);

        const args = await receiveArgs(req);
        try {
            const result = await method(...args);
            if (!result) {
                throw new Error('Server error');
            }
            res.end(JSON.stringify(result));
        } catch (err) {
            console.dir({ err });
            httpError(res, 500, 'Server error');
        }

    } else {
        const filePath = path.join(__dirname, `/static/${first}`);
        try {
            const file = await fs.promises.readFile(filePath);
            res.statusCode = 200;
            res.end(file);
        } catch (err) {
            httpError(res, 404, 'File is not found');
        }
    }
});

server.listen(8000);