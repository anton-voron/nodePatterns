import Actor from './Actor';
import { Message } from '../ActorSystem';
const ActorSystem = require('../ActorSystem');

class RootActor extends Actor {


    constructor(name: string) {
        super(name);
        console.log('Start actor: Root');
        ActorSystem.start("MONITORING");
        ActorSystem.start("NOTIFIER");
    }

    public message(): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public async exit() {
        await ActorSystem.stop("MONITORING");
        await ActorSystem.stop("NOTIFIER");
        console.log('Stop actor: Root');
    }

    // public clone(): Actor {
    //     const clone = Object.create(this);
    //     return Object.create(this);
    // }
};

ActorSystem.register(new RootActor("ROOT"));

