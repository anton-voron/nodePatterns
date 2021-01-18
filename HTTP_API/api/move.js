'use strict';


const move = (point, x, y) => {
    point.x += x;
    point.y += y;
}

module.exports = async (name, x, y) => {
    const shape = memory.get(name);
    if (!shape) return 'Shape is not found';

    [...Object.entries(shape)].forEach(([key, point]) => move(point, x, y));
    return 'Shape moved';
}