const http = require('http');
const net = require('net');
const fs = require('fs');
const path = require('path');
const fileName = path.join(__dirname, './index.html');

let index = fs.readFileSync(fileName, 'utf8');
fs.watchFile(fileName, (curr, prev) => {
    index = fs.readFileSync(fileName, 'utf8')
})
const socketServer = net.createServer();

socketServer.listen({
    host: '127.0.0.1',
    port: 8001,
    // exclusive: true
});

const server = http.createServer((req, res) => {
    if (req.url === '/chat') {
        res.end(JSON.stringify({ 'remoteAddress': `/127.0.0.1:8001` }))

        socketServer.on('connection', socket => {
            console.log('Socket connected');
            socket.on('data', data => {
                console.log('Data:', data.remoteAddress);
            })

            socket.write('💗');

        })
    }

    res.end(index);
});

server.listen({
    host: 'localhost',
    port: 8000,
})

