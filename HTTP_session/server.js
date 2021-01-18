'use strict';

const http = require('http');
const net = require('net');
const cluster = require('cluster');
const os = require('os');
const router = require('./router');

const Client = require('./client');

const PORT = process.env.PORT || 8000;
const pid = process.pid;


const types = {
    string: s => s,
    number: n => n.toString(),
    object: JSON.stringify,
    undefined: () => 'not found',
};

const dispatcher = async (req, res) => {
    const client = await Client.getInstance(req, res);

    const { method, url, headers } = req;
    const handler = router[url];
    res.setHeader('Process-Id', process.pid);
    res.on('finish', () => {
        if (client.session) client.session.save();
    });
    if (!handler) {
        res.statusCode = 404;
        res.end('Not found 404');
        return;
    }

    if (typeof handler === 'function') {
        handler(client)
            .then(data => {
                const type = typeof data;
                const serializer = types[type];
                const result = serializer(data);
                client.sendCookie();
                res.end(result)
            })
            .catch(err => {
                res.statusCode = 500;
                res.end('Internal Server Error 500');
                console.log(err);
            })
    };

};

if (cluster.isMaster) {
    const workers = [];
    const cpusCount = os.cpus().length;
    for (let i = 0; i < cpusCount; i++) {
        const worker = cluster.fork();
        workers.push(worker);
    }
    const ipToInt = ip => {
        return +ip.replace(/:/g, '.').split('.')
            .reduce((res, item) => (res << 8) + item, 0);
    };

    const balancer = (socket) => {
        const ip = ipToInt(socket.remoteAddress);
        const id = ip % cpusCount;
        const worker = workers[id];
        if (worker) worker.send({ name: 'socket' }, socket);
    }

    const server = new net.Server(balancer);
    server.listen(PORT);

} else {
    const server = http.createServer(dispatcher);
    server.listen(null);

    process.on('message', (message, socket) => {
        if (message.name === 'socket') {
            socket.server = server;
            server.emit('connection', socket);
        }
    })
}


