const path = require('path');
const Cache = require('./Cache');

const api = new Cache(path.join(__dirname, 'api'))
api.cacheFolder();
api.watchFolder();


const routing = {
    '/': path.join(__dirname, '/static/index.html'),
    '/api': (method) => api.get(method),
    '/client.js': path.join(__dirname, `/static/client.js`)
};




const router = (req) => {
    const { url } = req
    const apiReq = url.match(/(^\/api)/);

    let method;
    let route;
    if (apiReq) {
        const [srt, apiReq, methodName] = req.url.match(/(^\/api)\/(.*)/);
        method = routing[apiReq](methodName);
    } else {
        route = routing[url]
    };

    return { route, method }

};


module.exports = router;