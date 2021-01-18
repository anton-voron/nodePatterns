class AccountCommand {
    public operation: string;
    public owner: string;
    public amount: number;

    constructor(owner: string, operation: string, amount: number) {
        this.operation = operation;
        this.owner = owner;
        this.amount = amount;
    }
}

class AccountQuery {
    public operation: string;
    public owner: string;
    public rows: number;

    constructor(account: string, operation: string) {
        this.owner = account;
        this.operation = operation;
        this.rows = 0;
    }
}

class BankAccount {
    public owner: string;
    private balance: number;
    public static collection: Map<string, BankAccount>;

    constructor(owner: string) {
        this.owner = owner;
        this.balance = 0;
        if (!BankAccount.collection) {
            BankAccount.initialize()
        }
        BankAccount.collection.set(owner, this);
    }

    private static initialize(): void {
        this.collection = new Map<string, BankAccount>();
    }

    public static find(owner: string): BankAccount {
        return BankAccount.collection.get(owner);
    }

    public put(amount: number): void {
        this.balance += amount;
    }

    public get(amount: number): void {
        this.balance -= amount;
    }
};

const operations = {
    Withdraw: {
        execute: (command: AccountCommand) => {
            const account = BankAccount.find(command.owner);
            account.get(command.amount);
        },
        undo: (command: AccountCommand) => {
            const account = BankAccount.find(command.owner);
            account.put(command.amount);
        }
    },
    Income: {
        execute: (command: AccountCommand) => {
            const account = BankAccount.find(command.owner);
            account.put(command.amount);
        },
        undo: (command: AccountCommand) => {
            const account = BankAccount.find(command.owner);
            account.get(command.amount);
        }
    }
}

interface Query {
    name?: string,
    operation?: string
}

class Bank {
    private commands: AccountCommand[];
    public queries: AccountQuery[];

    constructor() {
        this.commands = [];
        this.queries = [];
    }

    public operation(account: BankAccount, amount: number) {
        const operation: string = amount < 0 ? 'Withdraw' : 'Income';
        const { execute } = operations[operation];
        const command: AccountCommand = new AccountCommand(account.owner, operation, Math.abs(amount));
        this.commands.push(command);
        execute(command);
    }

    public select(props: Query) {
        const { name, operation } = props;
        const query = new AccountQuery(name, operation);
        this.queries.push(query);

        this.commands.forEach(command => {
            let condition = true;
            if (name) condition = command.owner === name;
            if (operation) condition = condition && command.operation === operation;
            if (operation) condition = condition && command.operation === operation;
        })

        const result = [];
        query.rows = result.length;
        return result;
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
console.table([account1, account2]);

const res1 = bank.select({ name: 'Marcus Aurelius' });
console.table(res1);

const res2 = bank.select({ name: 'Antoninus Pius', operation: 'Income' });
console.table(res2);

const res3 = bank.select({ operation: 'Withdraw' });
console.table(res3);

console.log('Query logs:');
console.table(bank.queries);
