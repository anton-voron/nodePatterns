'use strict';

class AccountCommand {
    public operation: string;
    public accountOwner: string;
    public amount: number;

    constructor(operation: string, accountOwner: string, amount: number) {
        this.operation = operation
        this.accountOwner = accountOwner;
        this.amount = amount;
    }
}

class BankAccount {
    public owner: string;
    public balance: number;
    public static collection: Map<string, BankAccount> = new Map<string, BankAccount>();

    constructor(owner: string) {
        this.owner = owner;
        this.balance = 0;
        BankAccount.storeTransaction(this.owner, this);
    }

    public static find(owner: string): BankAccount {
        return this.collection.get(owner);
    }

    public static storeTransaction(owner: string, account: BankAccount): void {
        this.collection.set(owner, account);
    }
}

const operations = {
    Withdraw: {
        execute: (command: AccountCommand) => {
            const account = BankAccount.find(command.accountOwner);
            account.balance -= command.amount;
        },
        undo: (command: AccountCommand) => {
            const account = BankAccount.find(command.accountOwner);
            account.balance += command.amount;
        }
    },
    Income: {
        execute: (command: AccountCommand) => {
            const account = BankAccount.find(command.accountOwner);
            account.balance += command.amount;
        },
        undo: (command: AccountCommand) => {
            const account = BankAccount.find(command.accountOwner);
            account.balance -= command.amount;
        }
    }
}



class Bank {
    private commands: AccountCommand[];
    constructor() {
        this.commands = [];
    }

    public operation(account: BankAccount, amount: number): void {
        const operation = amount > 0 ? 'Income' : 'Withdraw';
        const { execute } = operations[operation];
        const command = new AccountCommand(operation, account.owner, Math.abs(amount));
        this.commands.push(command);
        execute(command);
    }

    public undo(count: number): void {
        for (let i = 0; i <= count; i++) {
            const command = this.commands.pop();
            const { operation } = command;
            const { undo } = operations[operation];
            undo(command);
        }
    }

    public showOperations() {
        console.table(this.commands);
    }
}

const bank = new Bank();
const account1 = new BankAccount('Marcus Aurelius');
bank.operation(account1, 1000);
bank.operation(account1, -50);
const account2 = new BankAccount('Antoninus Pius');
bank.operation(account2, 500);
bank.operation(account2, -100);
bank.operation(account2, 150);
bank.showOperations();
console.table([account1, account2]);
bank.undo(2);
bank.showOperations();
console.table([account1, account2]);
