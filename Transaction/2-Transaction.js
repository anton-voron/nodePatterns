const Transaction = () => { };

Transaction.start = (data) => {
    let delta = {};

    const methods = {
        commit() {
            Object.assign(data, delta);
            delta = {};
        },
        rollback() {
            delta = {};
        }
    };

    return new Proxy(data, {
        get(target, key) {
            if (methods.hasOwnProperty(key)) return methods[key];
            if (delta.hasOwnProperty(key)) return delta[key];
            return target[key];
        },
        set(target, key, value) {
            if (target[key] === value) return delete delta[key];
            else delta[key] = value;
            return true;
        }
    })
};

const data = { name: 'Marcus Aurelius', born: 121 };

console.log('data.name', data.name);
console.log('data.born', data.born);

const transaction = Transaction.start(data);

transaction.name = 'Mao Zedong';
transaction.born = 1893;
transaction.city = 'Shanhai';

console.log('data', data);

console.log('transaction', transaction);

transaction.rollback();

console.log('data', data);

console.log('transaction', transaction);