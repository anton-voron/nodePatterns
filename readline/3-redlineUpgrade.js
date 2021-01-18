const readline = require('readline');

require('../lib/all').forEach(method => console.log(method));

const write = s => process.stdout.write(s);

process.stdin.on('data', chunk => {
    console.log(chunk);
})
console.clear();

write('\x1b[10;10H')

setTimeout(() => {
    process.exit(0);
}, 10000)