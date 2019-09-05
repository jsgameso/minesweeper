"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Minesweeper_1 = __importDefault(require("./Minesweeper"));
exports.randomBetween = (min, max, ignore) => {
    let random = Math.floor(Math.random() * (max - min + 1) + min);
    if (typeof ignore === 'undefined') {
        return random;
    }
    else if (typeof ignore === 'number') {
        while (random === ignore) {
            random = Math.floor(Math.random() * (max - min + 1) + min);
        }
        return random;
    }
    else if (ignore instanceof Array && typeof ignore[0] === 'number') {
        while (ignore.indexOf(random) !== -1) {
            random = Math.floor(Math.random() * (max - min + 1) + min);
        }
        return random;
    }
    throw new Error('Invalid operation');
};
exports.getLuck = () => Boolean(exports.randomBetween(0, 1));
exports.random2dPositioner = (size, count, ignore = [-1, -1]) => {
    const result = [];
    let left = count;
    while (left > 0) {
        const column = exports.randomBetween(0, size - 1);
        const row = exports.randomBetween(0, size - 1);
        const exist = result.find(([x, y]) => x === column && y === row);
        const isIgnored = column === ignore[0] && row === ignore[1];
        if (exports.getLuck() && !exist && !isIgnored) {
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
exports.createWinnerBoard = (size, bombsCount, ignore) => {
    const bombs = exports.random2dPositioner(size, bombsCount, ignore);
    const board = Minesweeper_1.default.emptyBoard(size, 0);
    bombs.forEach(([x, y]) => {
        board[y][x] = 10;
        exports.coordinatesAround([x, y], size).forEach(([xi, yi]) => {
            if (board[yi][xi] < 10) {
                board[yi][xi] += 1;
            }
        });
    });
    const zeros = [];
    const numbers = {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: [],
        8: [],
    };
    board.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell === 0) {
                zeros.push([x, y]);
            }
            else if (cell < 9) {
                numbers[cell].push([x, y]);
            }
        });
    });
    return {
        board,
        bombs,
        numbers,
        zeros,
    };
};
//# sourceMappingURL=helpers.js.map