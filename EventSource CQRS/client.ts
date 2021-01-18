const EventEmitter = require('events');

const { BankWriter } = require('./BankWriter');
const { BankReader } = require('./BankReader');


const eventBus = new EventEmitter();

const bankWriter = new BankWriter(eventBus);
const bankReader1 = new BankReader(eventBus);
const bankReader2 = new BankReader(eventBus);
const bankReader3 = new BankReader(eventBus);


const anton = 'Anton Voron';
bankWriter.createAccount(anton);
bankWriter.execute(anton, 1000000);
bankWriter.execute(anton, -50000);
bankWriter.execute(anton, 300);

const kirill = 'Kirill Poluchyk';
bankWriter.createAccount(kirill);
bankWriter.execute(kirill, 200000);
bankWriter.execute(kirill, 300);
bankWriter.execute(kirill, -32100);


bankReader1.select();
bankReader2.select({ accountName: anton });
bankReader3.select({ operation: 'WITHDRAW' });
