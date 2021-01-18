const cluster = require('cluster');

module.exports = cluster.isMaster ? require('./MasterActor') : require('./WorkerActor');