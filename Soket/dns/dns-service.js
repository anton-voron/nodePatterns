const dns = require('dns');

dns.lookupService('172.217.20.206', 443, (err, host, service) => {
    if (err) throw err;
    console.log({ host, service });
})