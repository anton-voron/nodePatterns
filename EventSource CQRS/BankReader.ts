import { Operations } from './OperationsType';
import { Bank, BankAccount } from './Bank';
import { AccountCommand } from './BankWriter';
import { EventEmitter } from 'events';


class AccountQuery {
    public accountName: string | null;
    public operation: string | null;
    public rows: number;

    constructor(accountName?: string, operation?: string) {
        this.accountName = accountName;
        this.operation = operation;
        this.rows = 0;
    }
}

interface Query {
    accountName?: string,
    operation?: Operations
}

class BankReader {
    private bank: Bank;
    private commands: AccountCommand[];
    private queries: AccountQuery[];

    constructor(eventBus: EventEmitter) {
        this.bank = new Bank();
        this.commands = [];
        this.queries = [];
        eventBus.on('command', command => {
            this.commands.push(command);
            this.bank.execute(command);
        })

        eventBus.on('undo', command => {
            this.commands.pop();
            this.bank.undo(command);
        })
    }


    public select(query: Query = {}) {
        const { accountName = null, operation = null } = query;
        const accountQuery = new AccountQuery(accountName, operation);
        const result = [];
        this.commands.forEach((command: AccountCommand) => {
            let condition = true;
            if (accountName) condition = command.name === accountName;
            if (operation) condition = condition && command.operation === operation;
            if (condition) result.push(command);
        });
        accountQuery.rows = result.length;
        console.table(result);
    }
}

module.exports = {
    BankReader
}