'use strict';

// Типы библиотек
const libraries = {
    console: 'global',
    setTimeout: 'global',
    setInterval: 'global',
    fs: 'native',
    vm: 'native',
    path: 'native',
    util: 'native',
    ncp: 'module',
    colors: 'module',
    mkdirp: 'module',
};

// Ссылки на метаданные загруженных библиотек
const loaded = {};

// Ссылки на загруженные библиотеки
const api = {};

const loadLibrary = (name, parent) => {
    if (typeof parent !== Object) parent = { name: 'framework' }
    // console.log(`Loading dependency: ${name} into ${parent.name}`);
    const module = {};
    loaded[name] = module;
    module.name = name;
    module.type = libraries[name];

    switch (module.type) {
        case 'global': {
            module.interface = global[name];
            api[name] = module.interface;
            break;
        }
        case 'module':
        case 'native': {
            module.interface = require(name);
            api[name] = module.interface;
            break;
        }
        default: {
            module.type = 'app'

            // Circular context
            const context = {
                module: {},
            }
            module.context = context;
            module.context.global = module.context;

            module.sendBox = api.vm.createContext(module.context);

            const file = api.path.join(__dirname, `/${name}`);
            module.config = require(`${file}.json`)
            module.fileName = `${file}.js`;

            api.fs.readFile(module.fileName, 'utf-8', (err, src) => {
                if (err) {
                    console.error(err);
                    return;
                }

                module.script = new api.vm.Script(src, module.fileName);
                module.script.runInNewContext(module.sendBox);
                module.interface = module.sendBox.exports;
                api[name] = module.interface;

                if (module.config.api) {
                    module.config.api.forEach(item => loadLibrary(item, module))
                }
            })
            break;
        }

    }

}


['path', 'fs', 'vm', 'application'].forEach(loadLibrary);