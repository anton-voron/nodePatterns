import { Operations } from './OperationsType';
import { Bank, BankAccount } from './Bank';
import { EventEmitter } from 'events';

export class AccountCommand {
    public name: string;
    public operation: Operations;
    public amount: number;

    constructor(name: string, operation: Operations, amount: number = 0) {
        this.name = name;
        this.operation = operation;
        this.amount = amount;
    }
};

class BankWriter {
    private bank: Bank;
    private eventSub: EventEmitter;
    private commands: AccountCommand[];

    constructor(eventSub: EventEmitter) {
        this.bank = new Bank();
        this.eventSub = eventSub;
        this.commands = [];
    }

    public createAccount(accountName: string): void {
        const operation = Operations.CREATE;
        const command = new AccountCommand(accountName, operation);
        this.commands.push(command);
        this.eventSub.emit('command', command);
        this.bank.execute(command);
    }

    public execute(accountName: string, amount: number) {
        const operation = amount > 0 ? Operations.INCOME : Operations.WITHDRAW;
        const command = new AccountCommand(accountName, operation, Math.abs(amount));
        this.commands.push(command);
        this.eventSub.emit('command', command);
        this.bank.execute(command);
    }

    public undo(number: number) {
        for (let i = 0; i <= number; i++) {
            const command = this.commands.pop();
            this.eventSub.emit('undo', command);
            this.bank.undo(command);
        }
    }
}

module.exports = {
    AccountCommand,
    BankWriter
}