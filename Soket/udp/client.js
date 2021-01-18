'use strict';

const dgram = require('dgram');

const message = Buffer.from('Hellp');
const client = dgram.createSocket('udp4');

client.send(message, 3000, 'localhost', (error, bytes) => {
    if (error) {
        client.close();
        throw error;
    }
})
