'use strict';
const ENDPOINT = 'ws://127.0.0.1:8001';
const btn = document.getElementById('btn');
const socket = new WebSocket(ENDPOINT);

const buildAPI = methods => {
    const api = {};
    methods.forEach(method => {
        api[method] = (...args) => new Promise((resolve, reject) => {
            socket.send(JSON.stringify({
                method,
                args
            }))

            socket.onmessage = event => resolve(event.data);
            socket.onerror = error => reject(error);
        })
    });
    return api;
};

const api = buildAPI(['render', 'shape']);


const onClick = async (evt) => {
    const response = await api.render('Rect1', 0, 0, 10, 10);
    console.log(response);
};

btn.addEventListener('click', onClick);