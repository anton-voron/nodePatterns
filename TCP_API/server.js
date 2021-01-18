const HttpServer = require('./HttpServer');
require('./WsServer');

global.memory = new Map();

HttpServer.listen(8000, () => {
    console.log('http://localhost:8000/')
});
