import Actor from './Actor';
import { Message } from './Actor';
const ActorSystem = require('../system');

class NotifierActor extends Actor {

    constructor(name: string) {
        super(name);
    }


    public async message(message: Message) {
        const { url, success, status } = message;
        console.log(`Got responce from ${url}, result: ${success}, ${status}`);
    }

    public async exit() {
        console.log('Stop actor: NOTIFIER');
    }
}

ActorSystem.register(new NotifierActor("NOTIFIER"));