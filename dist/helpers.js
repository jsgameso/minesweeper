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
exports.coordinatesAround = ([x, y], maximum) => {
    return Array(8).fill([]).map((e, i) => {
        const position = i < 4 ? i : i + 1;
        const xi = (Math.floor(position / 3) - 1) + y;
        const yi = ((position % 3) - 1) + x;
        if (xi === -1 || xi > maximum || yi === -1 || yi > maximum) {
            return null;
        }
        return [xi, yi];
    }).filter((coordinates) => coordinates !== null);
};
exports.cloneBoard = (board) => {
    return [...board.map(r => [...r])];
};
//# sourceMappingURL=helpers.js.map