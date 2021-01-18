'use strict';

const net = require('net');

const user = { name: 'Anton', age: 23 };

const server = net.createServer(socket => {
    console.log('Connected', socket.localAddress);
    socket.write(JSON.stringify(user));
    socket.on('data', data => {
        const message = data.toString();
        console.log('####Data received (by server):', data);
        console.log('toString:', message);
    });
});

server.listen(8000, () => {
    console.log('http://localhost:8000/');
})