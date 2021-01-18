'use strict';
const path = require('path');
const fs = require('fs');

class ModuleContainer extends Map {

    constructor(folder) {
        super();
        this.folder = folder;
    }

    loadMethod(fileName) {
        const filePath = path.join(this.folder, fileName);
        const key = path.basename(fileName, '.js');
        try {
            const modulePath = require.resolve(filePath);
            delete require.cache[modulePath];
        } catch (error) {
            console.error(error);
            return;
        }

        try {
            const module = require(filePath);
            this.set(key, module);
        } catch (error) {
            console.error(error);
            this.delete(key);
        }
    }

    load() {
        const files = fs.readdirSync(this.folder);
        files.forEach(this.loadMethod.bind(this));
    }

    watchFolder() {
        fs.watch(this.folder, (event, filename) => {
            this.loadMethod(filename);
        })
    }
};

module.exports = ModuleContainer;