import Actor from './Actor';
import { Message } from './Actor';
const ActorSystem = require('../system');

class RootActor extends Actor {

    constructor(name: string) {
        super(name);
        console.log(`RootActor.contructor()`);
        ActorSystem.start("MONITORING");
        ActorSystem.start("NOTIFIER");
    }

    public message(message: Message): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public async exit() {
        await ActorSystem.stop("MONITORING");
        await ActorSystem.stop("NOTIFIER");
        console.log('Stop actor: Root');
    }
};

ActorSystem.register(new RootActor("ROOT"));

