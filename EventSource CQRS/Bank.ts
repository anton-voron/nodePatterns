import { AccountCommand } from './BankWriter';
import { BankOperation } from './BankOperation';

export interface BankI {
    createAccount(accountName: string): void;
    find(accountName: string): BankAccount;
    execute(command: AccountCommand): void;
}

export class BankAccount {
    public name: string;
    public balance: number;

    constructor(name: string, balance: number = 0) {
        this.name = name;
        this.balance = balance;
    }
}


export class Bank implements BankI {
    private accounts: Map<string, BankAccount>;

    constructor() {
        this.accounts = new Map<string, BankAccount>();
    }

    public createAccount(accountName: string): void {
        const account: BankAccount = new BankAccount(accountName);
        this.accounts.set(accountName, account);
    }


    public find(accountName: string): BankAccount {
        return this.accounts.get(accountName);
    }

    public execute(command: AccountCommand): void {
        BankOperation[command.operation].execute(command, this);
    }

    public undo(command: AccountCommand): void {
        BankOperation[command.operation].undo(command, this);
    }

    public getAccounts(): Map<string, BankAccount> {
        return this.accounts;
    }

};

module.exports = {
    BankAccount,
    Bank,
}