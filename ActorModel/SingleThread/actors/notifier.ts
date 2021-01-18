import Actor from './Actor';
import { Message } from '../ActorSystem';
const ActorSystem = require('../ActorSystem');

class NotifierActor extends Actor {

    constructor(name: string) {
        super(name);
    }


    public async message(message: Message) {
        const { url, success, status } = message;
        console.log(`Got responce from ${url}, result: ${success}, staus: ${status}`);
    }

    public async exit() {
        console.log('Stop actor: NOTIFIER');
    }
}

ActorSystem.register(new NotifierActor("NOTIFIER"));