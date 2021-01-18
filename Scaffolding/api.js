const ModuleContainer = require('./ModuleContainer');
const path = require('path');

const api = new ModuleContainer(path.join(__dirname, '/api'));

module.exports = api;