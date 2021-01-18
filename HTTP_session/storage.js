'use strict';


const fs = require('fs');
const path = require('path');
const v8 = require('v8');

const PATH = path.join(__dirname, '/sessions')

const loadFile = (fileName) => {
    try {
        const dataBuffer = fs.readFileSync(fileName);
        const dataJSON = dataBuffer.toString();
        return JSON.parse(dataJSON);
    } catch (err) {
        return []
    }
}



const saveData = (data, fileName) => {
    const dataJSON = JSON.stringify(data);
    fs.writeFileSync(fileName, dataJSON)
}

const readToken = (token, fileName) => {
    const data = loadFile(fileName);
    const searchingToken = data.find(el => el.token === token);
    if (searchingToken) {
        return searchingToken
    } else {
        return null;
    }
}

const writeToken = (token, fileName, session) => {
    const data = loadFile(fileName);
    const duplicateNotes = data.filter(el => {
        return el.token === token
    })

    if (duplicateNotes.length === 0) {
        data.push({
            token,
            session
        });
        saveData(data, fileName);
    }
}

const deleteToken = (token, fileName) => {
    const data = loadFile(fileName);
    const removeIdx = data.findIndex(el => el.token === token);
    if (removeIdx !== -1) {
        notes.splice(removeIdx, 1);
        saveData(data, fileName);
    }
}


const safePath = (fn) => (token, ...args) => {
    const callback = args[args.length - 1];
    if (typeof token !== 'string') {
        callback(new Error('Invalid session token'));
        return;
    }
    const dir = fs.existsSync(PATH);
    if (!dir) {
        fs.mkdirSync(PATH);
    }

    const fileName = path.join(PATH, token);
    if (!fileName.startsWith(PATH)) {
        callback(new Error('Invalid session token'));
        return;
    }
    fn(fileName, ...args);
}



// const readSession = safePath(readToken)
// const writeSession = safePath(writeToken);
// const deleteSession = safePath(deleteToken);


const readSession = safePath(fs.readFile)
const writeSession = safePath(fs.writeFile);
const deleteSession = safePath(fs.unlink);



class Storage extends Map {

    get(key, callback) {
        const value = super.get(key);
        if (value) {
            callback(null, value);
            return;
        }
        readSession(key, (err, data) => {
            if (err) {
                callback(err);
                return;
            }
            console.log(`Session loaded: ${key}`);
            const session = v8.deserialize(data);
            super.set(key, session);
            callback(null, session);
        });
    }

    save(key) {
        const value = super.get(key);
        if (value) {
            const data = v8.serialize(value);
            writeSession(key, data, () => {
                console.log(`Session saved: ${key}`);
            });
        }
    }

    delete(key) {
        console.log('Delete: ', key);
        deleteSession(key, () => {
            console.log(`Session deleted: ${key}`);
        });
    }
}

module.exports = new Storage()