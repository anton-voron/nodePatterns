'use strict';
const Session = require('./session');
const date = new Date();

const UNIX_EPOCH = 'Thu, 01 Jan 1970 00:00:00 GMT';
const COOKIE_EXPIRE = new Date(date.setDate(date.getDate() + 30));
const COOKIE_DELETE = `=deleted; Expires=${UNIX_EPOCH}; Path=/; Domain=`;

const parseHost = host => {
    if (!host) return 'no-host-name-in-http-headers';

    const portOffset = host.indexOf(':');
    if (portOffset > -1) {
        host = host.substr(0, portOffset);
    }
    return host;
}

class Client {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.host = parseHost(req.headers.host);
        this.token = undefined;
        this.session = null;
        this.cookie = new Map();
        this.preparedCookie = [];
        // This method get cookies from req and pass into client obj
        this.parseCookie();
    }

    static async getInstance(req, res) {
        const client = new Client(req, res);
        await Session.restore(client);
        return client;
    }

    parseCookie() {
        const { req } = this;
        const { cookie } = req.headers;
        if (!cookie) return;
        const items = cookie.split(';');
        items.forEach(item => {
            const part = item.split('=');
            const key = part[0].trim();
            const value = part[1] || '';
            this.cookie.set(key, value);
        });
    }

    setCookie(name, value, httpOnly = false) {
        const { host } = this;
        const expires = `expires=${COOKIE_EXPIRE}`
        const cookie = `${name}=${value}; ${expires}; Path=/; Domain=${host}`;
        if (httpOnly) cookie += '; HttpOnly';
        this.preparedCookie.push(cookie);
        this.cookie.set(name, value);
    }

    deleteCookie(key) {
        this.preparedCookie.push(key + COOKIE_DELETE + this.host)
    }

    sendCookie() {
        const { res, preparedCookie } = this;
        if (preparedCookie.length && !res.headersSent) {
            console.dir({ preparedCookie });
            res.setHeader('Set-Cookie', preparedCookie);
        }
    }

    getCookie(key) {
        return this.cookie.get(key);
    }
}

module.exports = Client