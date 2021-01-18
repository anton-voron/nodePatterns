class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Rect {

    constructor(name, x1, x2, y1, y2) {
        this.name = name;
        this.a = new Point(x1, y1);
        this.b = new Point(x1, y2);
        this.c = new Point(x2, y2);
        this.d = new Point(x2, y1);
    }
}

module.exports = async (name, x1, x2, y1, y2) => {
    const rect = new Rect(name, x1, y1, x2, y2);
    memory.set(name, rect);
    return rect;
}