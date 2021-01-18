'use strict';

const storage = require('./storage.js');


const TOKEN_LENGTH = 32;
const ALPHA_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ALPHA_LOWER = 'abcdefghijklmnopqrstuvwxyz';
const ALPHA = ALPHA_UPPER + ALPHA_LOWER;
const DIGIT = '0123456789';
const ALPHA_DIGIT = ALPHA + DIGIT;

const generateToken = () => {
    const base = ALPHA_DIGIT.length;
    let token = '';
    for (let i = 0; i <= TOKEN_LENGTH; i++) {
        const idx = Math.floor(Math.random() * base);
        token += ALPHA_DIGIT[idx];
    }
    return token;
}

class Session extends Map {
    constructor(token) {
        super();
        this.token = token;
    }

    static async start(client) {
        if (client.session) return client.session;
        const token = generateToken();
        const session = new Session(token);
        client.token = token;
        client.session = session;
        client.setCookie('token', token);
        storage.set(token, session);
        return session;
    }

    static async restore(client) {
        const sessionToken = client.getCookie('token');
        if (sessionToken) {
            return new Promise((resolve, reject) => {
                storage.get(sessionToken, (err, session) => {
                    if (err) reject(new Error('No session'));
                    Object.setPrototypeOf(session, Session.prototype);
                    client.token = sessionToken;
                    client.session = session;
                    resolve(session);
                })
            })
        }
    }

    delete(client) {
        const { token } = client;
        if (token) {
            client.deleteCookie('token');
            client.token = undefined;
            client.session = null;
            storage.delete(token);
        }
    }

    save() {
        storage.save(this.token);
    }
}

module.exports = Session;