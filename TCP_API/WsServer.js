
'use strict';

const WebSocket = require('ws');
const router = require('./router');

const connection = socket => {
    socket.on('message', async data => {
        const req = JSON.parse(data);
        const { method, args } = req;
        const callback = router[method];
        const result = await callback(...args);
        socket.send(JSON.stringify(result));
    });
};


const server = new WebSocket.Server({
    host: '127.0.0.1',
    port: 8001,
});

server.on('connection', connection);

module.exports = server;
