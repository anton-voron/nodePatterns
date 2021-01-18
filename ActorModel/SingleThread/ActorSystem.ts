import Actor from './actors/Actor';

export interface Message {
    url: string,
    success: boolean,
    status: number | string,
}

interface ActorList {
    actor: Actor
    instances: Actor[],
    ready: Actor[],
    queue: any[]
}

class ActorSystem {
    private static actorMap: Map<string, ActorList> = new Map<string, ActorList>();

    public static register(actor: Actor) {
        const instances = [];
        const ready = [];
        const queue = [];
        this.actorMap.set(actor.getName(), { actor, instances, ready, queue });
    }

    public static start(actorName: string, count: number = 1) {
        require(`./actors/${actorName.toLowerCase()}.ts`);
        const record = this.actorMap.get(actorName);
        if (record) {
            const ActorClass: Actor = record.actor;
            const { instances, ready } = record;
            for (let i = 0; i < count; i++) {
                const actorInstance: Actor = ActorClass.clone();
                instances.push(actorInstance);
                ready.push(actorInstance);
            }
        }
    }

    public static stop(actorName: string) { }
    public static async send(actorName: string, message: Message) {
        const record = this.actorMap.get(actorName);
        if (record) {
            const { ready, queue } = record;
            const actor = ready.shift();
            if (!actor) {
                queue.push(message);
                return;
            }
            await actor.message(message);
            ready.push(actor);
            if (queue.length > 0) {
                const next = queue.shift();
                this.send(actorName, next);
            }
        }

    }
}

module.exports = ActorSystem