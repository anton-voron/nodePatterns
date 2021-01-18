
const render = (name) => {
    const rect = memory.get(name);
    if (!rect) return `Rect with name ${name} is not found`;
    const points = Object.values(rect).filter(point => {
        return point.constructor !== String;
    });
    const svg = [];
    svg.push('<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">');
    svg.push('<polygon points="');
    svg.push(points.map(({ x, y }) => `${x},${y}`).join(' '));
    svg.push('" /></svg>');
    return svg.join('');
};

module.exports = async name => {
    return render(name);
}