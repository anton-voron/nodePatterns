import { Worker } from 'cluster';
import Actor, { Message } from './actors/Actor'
import WorkerActor from './WorkerActor';
const os = require('os');
const cluster = require('cluster');


interface ActorList {
    initialized: boolean;
    instances: Worker[],
    ready: Worker[],
    queue: Message[]
}

class MasterActor {
    private static actorWorkers: Map<string, ActorList> = new Map<string, ActorList>();
    private static cpus: number = os.cpus().length;

    public static register(actorName: string) {
        if (!this.actorWorkers.has(actorName)) {
            const initialized = false;
            const instances: Worker[] = [];
            const ready: Worker[] = [];
            const queue: Message[] = [];
            this.actorWorkers.set(actorName, { initialized, instances, ready, queue });
        }
    }

    public static start(actorName: string, count: number = 1) {
        this.register(actorName);

        if (this.actorWorkers.has(actorName)) {
            const record = this.actorWorkers.get(actorName);
            let { initialized, ready, instances } = record;
            if (initialized === false) {
                for (let i = 0; i < count; i++) {
                    const actorWorker: Worker = cluster.fork(`${__dirname}/WorkerActor.ts`);
                    this.subscribe(actorWorker);
                    instances.push(actorWorker);
                    ready.push(actorWorker);
                    actorWorker.send({ command: 'start', actorName, count });
                }
                this.actorWorkers.set(actorName, { ...record, instances, ready, initialized: true });
            }
        }
    }

    public static async send(actorName: string, message: Message) {
        const record: ActorList = this.actorWorkers.get(actorName);

        if (record) {
            const { instances, ready, queue } = record;
            instances.forEach(worker => {
                console.log(worker.process.pid);

                // if (worker.process.pid === pid) {
                // const actorWorker: Worker = ready.shift();
                // if (!actorWorker) {
                //     queue.push(message);
                // }
                worker.send({ command: 'message', message });
                // }
            })
            // await this.ready(actorName, pid);
        }
    }

    public static async ready(actorName: string, pid) {
        const record: ActorList = this.actorWorkers.get(actorName);
        if (record) {
            const { instances, ready, queue } = record;
            instances.forEach(worker => {
                if (worker.process.pid == pid) {
                    ready.push(worker);
                }
            })
            if (queue.length > 0) {
                const next = queue.shift();
                this.send(actorName, next);
            }
        }
    };

    private static subscribe(actorWorker: Worker): void {
        actorWorker.on('message', data => {
            const { command } = data;
            switch (command) {
                case 'register': {
                    const { actorName } = data;
                    MasterActor.register(actorName);
                }
                case 'start': {
                    const { actorName, count } = data;
                    MasterActor.start(actorName, count);
                    return;
                }
                case 'send': {
                    const { actorName, message } = data;
                    MasterActor.send(actorName, message);
                }
            }
        })

        actorWorker.on('exit', code => {
            console.log('Worker exited:', code);
        });
    }
};

module.exports = MasterActor;