import Actor from './Actor';
import { Message } from '../ActorSystem';
const http = require('http');
const ActorSystem = require('../ActorSystem');

class MonitoirngActor extends Actor {
    private timer;
    private prevSecess: boolean;
    private INTERVAL: number = 2000;
    private URL: string = 'http://localhost:8000/';

    constructor(name: string) {
        super(name);
        this.prevSecess = true;
        this.timer = setInterval(() => this.attempt(), this.INTERVAL);
    }

    private attempt() {
        http.get(this.URL, res => {
            const { statusCode } = res;
            const prevSecess = statusCode === 200;
            const buff = [];
            res.on('data', data => {
                buff.push(data);
            })

            res.on('end', () => {
                // console.log(buff.toString());
                this.notify({ url: this.URL, success: this.prevSecess, status: buff.toString() })
            })
        })
            .on('error', (err) => {
                this.notify({ url: this.URL, success: false, status: err.message })
            })
    }

    private notify(message: Message) {
        ActorSystem.send('NOTIFIER', message);
    }

    public message(): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public async exit() {
        clearInterval(this.timer);
        console.log('Stop actor: Monitoring');
    }
};

ActorSystem.register(new MonitoirngActor("MONITORING"));

