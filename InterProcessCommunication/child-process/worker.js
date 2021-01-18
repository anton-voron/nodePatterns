'use strict';

// console.log('Hello from worker', process.pid);

const calculation = item => item * 2;

process.on('message', (message, sendHandler) => {
    // console.log(message, sendHandler);
    // console.log('Message to worker: ', process.pid);
    // console.log('from master: ', message);

    const result = message.task.map(calculation);
    process.send({ result });
})