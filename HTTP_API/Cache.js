const fs = require('fs');
const path = require('path');



class Cache extends Map {

    constructor(folder) {
        super();
        this.folder = folder;
    }

    cacheFile(fileName) {
        const filePath = path.join(this.folder, fileName);
        const key = path.basename(fileName, '.js');
        try {
            const modulePath = require.resolve(filePath);
            delete require.cache[modulePath];
        } catch (error) {
            console.log(1, error);
            return;
        }

        try {
            const method = require(filePath);
            this.set(key, method)
        } catch (error) {
            console.log(2, error);
            this.delete(key);
        }

    }

    cacheFolder() {
        const files = fs.readdirSync(this.folder);
        files.forEach(this.cacheFile.bind(this))
    }

    watchFolder() {
        fs.watch(this.folder, (event, filename) => {
            this.cacheFile(filename);
        })
    }
};

module.exports = Cache;