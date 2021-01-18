const fs = require('fs');
const http = require('http');
const path = require('path');

const cache = new Map();
const lib = './lib/';

const cacheFile = path => {
    const filePath = lib + path;
    try {
        const libPath = require.resolve(filePath);
        delete require.cache[libPath];
    } catch (error) {
        return;
    }
    try {
        const mod = require(filePath);
        cache.set(path, mod)
    } catch (error) {
        cache.delete(path)
    }
};

const cacheFolder = path => {
    fs.readdir(path, (err, files) => {
        if (err) return;
        files.forEach(cacheFile);
    })
};

const watch = path => {
    fs.watch(path, (event, filename) => {
        cacheFile(filename);
    })
};

cacheFolder(lib);
watch(lib);

const ls = (res, list) => {
    res.write('<html>');
    for (const name of list) {
        res.write(`<li><a href="${name}"/>${name}</li>`)
    }
    res.end('</html>')
};

http.createServer((req, res) => {
    const url = req.url.substring(1);
    console.log(url);
    if (!url) return ls(res, cache.keys());
    const [mod, method] = url.split('/');
    const methods = cache.get(mod);
    if (methods) {
        if (!method) return ls(res, Object.keys(methods));
        const handler = methods[method];
        if (handler) {
            res.end(handler().toString());
            return;
        }
    }
    res.end(`File ${url} was not found`)
}).listen(8000, () => {
    console.log('http://localhost:8000/');
})