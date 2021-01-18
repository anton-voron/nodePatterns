export interface Message {
    url: string,
    success: boolean,
    status: number | string,
}

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
        const assign = Object.assign(clone, this);
        return assign;
    };

    public abstract message(message: Message): Promise<void>;
    public abstract exit(): Promise<void>;
}