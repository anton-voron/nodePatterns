// const fetch = require('node-fetch');

// const url = 'https://api.monobank.ua/bank/currency'
// async function getList() {
//     return fetch(url)
// }

// async function main() {
//     const list = await getList();

// };

// main();

function change(cash) {
    const cacheBack = {
        two: 0,
        five: 0,
        ten: 0
    }
    const isEven = cash % 2 == 0;
    if (isEven && cash < 10) {
        cacheBack.two = cash / 2;
    } else if (isEven && cash >= 10) {
        cacheBack.ten = cash / 10;
    } else if(c)
    console.log(cacheBack);
    return cacheBack
}

change(6);