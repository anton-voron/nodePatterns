'use strict';

const http = require('http');

const user = { name: 'jura', age: 22, lastname: 'burda' };

const routing = {
    '/': 'welcome to homepage',
    '/user': user,
    '/user/name': () => user.name,
    '/user/age': () => user.age,
    '/user/*': (client, par) => 'parameter=' + par[0]
};

const types = {
    string: s => s,
    number: n => n.toString(),
    object: JSON.stringify,
    undefined: () => 'not found',
    function: (fn, par, client) => fn(client, par),
}

const match = [];
for (const key in routing) {
    if (key.includes('*')) {
        const rx = new RegExp(key.replace('*', '(.*)'));
        const route = routing[key];
        match.push([rx, route]);
        delete routing[key];
    }
}

console.log(routing);
console.log(match);

const router = (client) => {
    let par;
    const { url } = client.req;
    let route = routing[url];
    if (!route) {
        for (let i = 0; i < match.length; i++) {
            const rx = match[i];
            par = url.match(rx[0]);

            if (par) {
                par.shift();
                route = rx[1];
                break;
            }
        }
    }
    const type = typeof route;
    const renderer = types[type];
    return renderer(route, par, client)
}


http.createServer((req, res) => {
    res.end(router({ req, res }) + '')
}).listen(8000);