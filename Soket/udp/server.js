'use strict';

const dgram = require('dgram');
const { info } = require('console');

const server = dgram.createSocket('udp4');

server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
});

server.on('message', (msg, rinfo) => {
    console.dir({ msg, rinfo });

    server.send('Message from server', rinfo.port, rinfo.address, err => {
        if (err) {
            console.log('Error: ', err);
            server.close();
        } else {
            console.log('Data sent!!!');
        }
    })
});

server.on('listening', () => {
    var address = server.address();
    var port = address.port;
    var family = address.family;
    var ipaddr = address.address;
    console.log('Server is listening at port' + port);
    console.log('Server ip :' + ipaddr);
    console.log('Server is IP4/IP6 : ' + family);
});



server.bind(3000);
