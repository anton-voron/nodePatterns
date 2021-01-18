import Actor, { Message } from './actors/Actor'
const cluster = require('cluster');

export default class WorkerActor {

    public static actor: Actor;
    public static instance: Actor;

    public static register(actor: Actor) {
        // console.log(`WorkerActor.register(${actor.getName()}) PID: ${process.pid}`);
        this.actor = actor;
    }

    public static start(actorName: string, count = 1) {
        // console.log('WorkerActor.start()', actorName);

        // require(`./actors/${actorName.toLowerCase()}.ts`);
        // this.instance = this.actor.clone();

        process.send({ command: 'start', actorName, count });
    }

    public static send(actorName: string, message: Message) {
        // console.log('WorkerActor.send()', actorName);
        const pid = process.pid;
        process.send({ command: 'send', actorName, message })
    }

    public static message(message: Message) {
        this.instance.message(message);
    }
};

process.on('message', (data) => {

    const { command } = data;
    switch (command) {
        case 'start': {
            const { actorName, count } = data;
            require(`./actors/${actorName.toLowerCase()}.ts`);
            const instance = WorkerActor.actor.clone();
            WorkerActor.instance = instance;
            return;
        }
        case 'message': {
            const { message } = data;
            WorkerActor.message(message);
            return;
        }
        case 'stop': {
            console.log(data);
            return;
        }
    }

});

module.exports = WorkerActor;