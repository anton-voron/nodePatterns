const fs = require('fs');
const path = require('path');



module.exports = async (id, instance) => {
    const fileName = path.join(__dirname, `../data/${id}.json`);
    console.log(fileName);
    const data = JSON.stringify(instance);
    fs.writeFileSync(fileName, data);
    return true;
}