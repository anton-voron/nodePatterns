'use strict';

const http = require('http');
const fs = require('fs');
const router = require('./router');

global.memory = new Map();


const receiveArgs = async req => new Promise((resolve, reject) => {
    const body = [];
    req.on('data', chunk => {
        body.push(chunk);
    }).on('end', async () => {
        const data = body.join('');
        const args = JSON.parse(data);
        resolve(args);
    })
})

const httpError = (res, status, message) => {
    res.statusCode = status;
    res.end(`"${message}"`);
};


const dispatcher = async (req, res) => {
    const { route, method } = await router(req);
    if (method) {
        const args = await receiveArgs(req);
        try {
            const result = await method(...args);
            if (!result) {
                httpError(res, 500, 'Server error');
                return;
            }
            res.end(JSON.stringify(result));
        } catch (err) {
            console.dir({ err });
            httpError(res, 500, 'Server error');
        }
    } else {
        try {
            const data = fs.readFileSync(route);
            res.end(data)
        } catch (error) {
            httpError(res, 404, 'File is not found');
        }
    }
};

http.createServer(dispatcher).listen(8000)