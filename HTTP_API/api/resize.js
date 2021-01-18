'use strict';

const resize = (point, k) => {
    let { x, y } = point;
    x *= k;
    y *= k;
    point.x = x;
    point.y = y;
};

module.exports = async (name, k) => {
    const shape = memory.get(name);
    if (!shape) return 'Shape is not found';

    for (let key in shape) {
        resize(shape[key], k);
    }
    return 'Shape resized';
}