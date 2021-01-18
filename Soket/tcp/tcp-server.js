'use strict';

const net = require('net');

const onData = data => {
    console.log('📨:', data);
};

const finalData = buffer => {
    const data = buffer.toString();
    console.log('📨:', data);
}

const server = net.createServer(socket => {
    console.dir(socket.address());
    socket.setNoDelay(true);
    socket.write('💗');
    socket.on('data', finalData);
    socket.on('myEvt', finalData)

    socket.on('error', err => {
        console.log('Socket error: ', err);
    })
});

server.on('error', err => {
    console.log('Server error: ', err);
})

server.listen(2000);