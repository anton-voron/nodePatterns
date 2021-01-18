const ModuleContainer = require('./ModuleContainer');
const path = require('path');

const schema = new ModuleContainer(path.join(__dirname, '/schema'));

module.exports = schema;