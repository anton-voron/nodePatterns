'use strict';

const net = require('net');

const socket = new net.Socket();

const client = net.createConnection({ port: 2000 }, () => {
    // 'connect' listener.
    console.log('connected to server!');
    client.write('💋');
});

client.on('data', (data) => {
    console.log(data.toString());
    client.end();
});

client.on('end', () => {
    console.log('disconnected from server');
});

client.write('Data from myEvt')



// socket.on('data', data => {
//     console.log('📨:', data);
// });

// socket.connect({
//     port: 2000,
//     host: '127.0.0.1',
// }, () => {
//     socket.write('💋');
// });

// socket.unref();