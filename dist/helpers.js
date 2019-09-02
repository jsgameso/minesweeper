"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomBetween = (min, max) => Math.round((Math.random() * max) / (min + 1));
exports.getLuck = () => Boolean(exports.randomBetween(0, 1));
exports.random2dPositioner = (size, count, ignore = [0, 0]) => {
    const result = [];
    let left = count;
    while (left > 0) {
        const row = exports.randomBetween(0, size - 1);
        const column = exports.randomBetween(0, size - 1);
        if (exports.getLuck() && !(result.find(([x, y]) => x === row && y === column)) && !(row === ignore[0] && column === ignore[1])) {
            result.push([row, column]);
            left -= 1;
        }
    }
    return result;
};
exports.coordinatesAround = ([x, y]) => {
    const right = x - 1;
    const left = x + 1;
    const top = y - 1;
    const bottom = y + 1;
    return [[left, top], [x, top], [right, top], [left, y], [right, y], [left, bottom], [x, bottom], [right, bottom]];
};
exports.cloneBoard = (board) => {
    return [...board.map(r => [...r])];
};
//# sourceMappingURL=helpers.js.map