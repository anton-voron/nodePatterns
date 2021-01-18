'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');

const PATH_INDEX = path.join(__dirname, '/static/index.html');

const httpError = (res, status, message) => {
    res.statusCode = status;
    res.end(`"${message}"`);
};

const httpHandler = async (req, res) => {
    try {
        const indexHtml = fs.readFileSync(PATH_INDEX);
        res.end(indexHtml)
    } catch (error) {
        httpError(res, 404, 'File is not found');
    }
};


const httpServer = http.createServer(httpHandler);

module.exports = httpServer;


