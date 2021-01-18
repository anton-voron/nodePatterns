import { BankI, BankAccount } from './Bank';
import { AccountCommand } from './BankWriter';

export class BankOperation {

    public static WITHDRAW = {
        execute: (command: AccountCommand, bank: BankI) => {
            const account: BankAccount = bank.find(command.name);
            BankOperation.get(account, command.amount);
        },
        undo: (command: AccountCommand, bank: BankI) => {
            const account: BankAccount = bank.find(command.name);
            BankOperation.put(account, command.amount);
        }
    }

    public static INCOME = {
        execute: (command: AccountCommand, bank: BankI) => {
            const account: BankAccount = bank.find(command.name);
            BankOperation.put(account, command.amount);
        },
        undo: (command: AccountCommand, bank: BankI) => {
            const account: BankAccount = bank.find(command.name);
            BankOperation.get(account, command.amount);
        }
    }

    public static CREATE = {
        execute: (command: AccountCommand, bank: BankI) => {
            const account = bank.find(command.name);
            if (!account) bank.createAccount(command.name);
        },
        undo: (command: AccountCommand, bank: BankI) => {
            const account: BankAccount = bank.find(command.name);
            if (!account) account.name = 'DELETED';
        }
    }


    private static put(account: BankAccount, amount: number): void {
        account.balance += amount;
    }

    private static get(account: BankAccount, amount: number) {
        account.balance -= amount;
    }
}
