const Transaction = () => { };

Transaction.start = (data) => {
    let delta = {};
    const deleteDelta = new Set();

    const methods = {
        commit() {
            for (const key of deleteDelta) {
                delete data[key];
            }
            Object.assign(data, delta);
            delta = {};
        },
        rollback() {
            delta = {};
            deleteDelta.clear();
        },
        clone() {
            const cloned = Transaction.start(data);
            Object.assign(cloned.delta, delta);
            return cloned;
        }
    };

    return new Proxy(data, {
        get(target, key) {
            if (methods.hasOwnProperty(key)) return methods[key];
            if (delta.hasOwnProperty(key)) return delta[key];
            return target[key];
        },
        getOwnPropertyDescriptor: (target, key) => (
            Object.getOwnPropertyDescriptor(
                delta.hasOwnProperty(key) ? delta : target, key
            )
        ),
        ownKeys() {
            const changes = Object.keys(delta);
            const keys = Object.keys(data).concat(changes);
            const set = new Set(keys);
            return Array.from(set);
        },
        set(target, key, val) {
            if (target[key] === val) delete delta[key];
            else delta[key] = val;
            return true;
        },
        deleteProperty(target, prop) {
            if (deleteDelta.has(prop)) return false;
            deleteDelta.add(prop);
            return true;
        },
    })
};

const data = { name: 'Marcus Aurelius', born: 121 };

const transaction = Transaction.start(data);
console.log('data', JSON.stringify(data));
console.log('transaction', JSON.stringify(transaction));

transaction.name = 'Mao Zedong';
transaction.born = 1893;
transaction.city = 'Shaoshan';

console.log('\noutput with JSON.stringify:');
console.log('data', JSON.stringify(data));
console.log('transaction', JSON.stringify(transaction));

console.log('\noutput with console.dir:');
console.dir({ transaction });

console.log('\noutput with for-in:');
for (const key in transaction) {
    console.log(key, transaction[key]);
}

transaction.commit();
console.log('data', JSON.stringify(data));
console.log('transaction', JSON.stringify(transaction));