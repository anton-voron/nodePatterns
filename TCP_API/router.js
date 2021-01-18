
const router = {
    'shape': async (...args) => require('./api/shape')(...args),
    'render': async (...args) => require('./api/render')(...args),
};

module.exports = router;