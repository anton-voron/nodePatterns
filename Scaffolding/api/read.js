const fs = require('fs');
const path = require('path');



module.exports = async (id) => {
    const fileName = path.join(__dirname, `../data/${id}.json`);
    const data = await fs.promises.readFile(fileName, 'utf-8');
    return JSON.parse(data);
}