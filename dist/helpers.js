"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
exports.getLuck = () => Boolean(exports.randomBetween(0, 1));
exports.random2dPositioner = (size, count, ignore = [-1, -1]) => {
    const result = [];
    let left = count;
    while (left > 0) {
        const column = exports.randomBetween(0, size - 1);
        const row = exports.randomBetween(0, size - 1);
        const exist = result.find(([x, y]) => x === column && y === column);
        if (exports.getLuck() && !exist && !(column === ignore[0] && row === ignore[1])) {
            result.push([column, row]);
            left -= 1;
        }
    }
    return result;
};
exports.coordinatesAround = ([x, y], size) => {
    return Array(8).fill([]).map((e, i) => {
        const position = i < 4 ? i : i + 1;
        const xi = ((position % 3) - 1) + x;
        const yi = (Math.floor(position / 3) - 1) + y;
        if (xi === -1 || xi >= size || yi === -1 || yi >= size) {
            return null;
        }
        return [xi, yi];
    }).filter((coordinates) => coordinates !== null);
};
exports.cloneBoard = (board) => {
    return [...board.map(r => [...r])];
};
//# sourceMappingURL=helpers.js.map