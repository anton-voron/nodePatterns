'use strict';

const http = require('http');
const os = require('os');
const cluster = require('cluster');

const user = { name: 'jura', age: 22 };
const pid = process.pid;
const PORT = process.env.PORT || 8000;

const routing = {
    '/': 'welcome to homepage',
    '/user': user,
    '/user/name': () => user.name,
    '/user/age': () => user.age,
    '/api/method1': (req, res, callback) => {
        console.log(req.url + ' ' + res.statusCode);
        callback({ status: res.statusCode });
    },
    '/api/method2': req => ({
        user,
        url: req.url,
        cookie: req.headers.cookie,
    }),
};

const types = {
    object: ([data], callback) => callback(JSON.stringify(data)),
    string: (s, callback) => callback(s),
    undefined: (args, callback) => callback('not found'),
    function: ([fn, req, res], callback) => {
        if (fn.length === 1) {
            const result = JSON.stringify(fn(req));
            callback(result);
        }
        return fn(req, res, callback);
    },
};



const serve = (data, req, res) => {
    res.setHeader('Process-Id', pid);
    const type = typeof data;
    if (type === 'string') return res.end(data);
    const serializer = types[type];
    serializer([data, req, res], data => serve(data, req, res));
};

if (cluster.isMaster) {
    const count = os.cpus().length;
    console.log(`Master pid: ${pid}`);
    console.log(`Starting ${count} forks`);
    for (let i = 0; i < count; i++) {
        cluster.fork();
    }
} else {
    const id = cluster.worker.id;
    console.log(`Worker: ${id}, pid: ${pid}, port: ${PORT}`);
    http.createServer((req, res) => {
        const { url } = req;
        const data = routing[url];
        serve(data, req, res);

    }).listen(8000)
}


// const main = () => {
//     const data = (req, res, callback = (data) => data.req.user.name) => {
//         return callback({ req, res });
//     }

//     const serialize = types[typeof data];
//     const result = serialize([data, { user }, 'resA'], (data) => data);
//     console.log(result);
// };
// main();
