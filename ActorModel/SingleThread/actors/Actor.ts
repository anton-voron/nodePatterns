import { Message } from '../ActorSystem';
export default abstract class Actor {
    private name: string;
    constructor(name: string) {
        this.name = name;
    }
    public getName(): string {
        return this.name;
    }

    public clone(): Actor {
        const clone = Object.create(this);
        return Object.assign(clone, this);
    };

    public abstract message(message: Message): Promise<void>;
    public abstract exit(): Promise<void>;
}