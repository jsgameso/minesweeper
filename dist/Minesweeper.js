"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
class Minesweeper {
    constructor(size = 10, level = 'medium') {
        this.size = size;
        this.level = level;
        this.positions = [];
        this.solution = [];
        this.whiteBoard = Array(this.size).fill(Array(this.size).fill(0));
        this.emptyBoard = Array(this.size).fill(Array(this.size).fill(null));
        this.gameStatus = 'loose';
        this.currentBoard = helpers_1.cloneBoard(this.emptyBoard);
        this.registeredEvents = {
            board: [],
            error: [],
            game: [],
        };
        this.places = this.size ** 2;
        const ratios = {
            easy: 0.07,
            medium: 0.15,
            hard: 0.35,
        };
        this.mines = Math.round(this.places * ratios[this.level]) + 1;
    }
    get board() {
        return helpers_1.cloneBoard(this.currentBoard);
    }
    get status() {
        return this.gameStatus;
    }
    on(event, callback) {
        if (event === 'board') {
            this.registeredEvents.board.push(callback);
        }
        else if (event === 'error') {
            this.registeredEvents.error.push(callback);
        }
        else if (event === 'game') {
            this.registeredEvents.game.push(callback);
        }
    }
    newGame(firstMove) {
        this.positions = helpers_1.random2dPositioner(this.size, this.mines, firstMove);
        const tempBoard = helpers_1.cloneBoard(this.whiteBoard);
        this.positions.forEach(([x, y]) => {
            tempBoard[y][x] = 10;
            helpers_1.coordinatesAround([x, y], this.size - 1).forEach(([xi, yi]) => {
                if (tempBoard[yi][xi] < 10) {
                    tempBoard[yi][xi] += 1;
                }
            });
        });
        this.solution = tempBoard;
        this.currentBoard = helpers_1.cloneBoard(this.emptyBoard);
        const [x, y] = firstMove;
        this.gameStatus = 'active';
        if (this.solution[y][x] === 0) {
            return this.revealZeros(firstMove);
        }
        this.currentBoard[y][x] = this.solution[y][x];
        this.dispatchEvent('board');
        return this.currentBoard;
    }
    reveal([x, y]) {
        if (x < 0 || x >= this.size || y < 0 || y >= this.size) {
            const error = new Error('Invalid Move');
            this.dispatchEvent('error', error);
            throw error;
        }
        if (this.gameStatus === 'active') {
            const revealed = this.solution[y][x];
            if (revealed === 10) {
                return this.gameOver();
            }
            if (revealed === 0) {
                return this.revealZeros([x, y]);
            }
            const workingBoard = helpers_1.cloneBoard(this.currentBoard);
            workingBoard[y][x] = revealed;
            this.currentBoard = workingBoard;
            this.dispatchEvent('board');
            return this.currentBoard;
        }
        return this.currentBoard;
    }
    surrender() {
        return this.gameOver();
    }
    gameOver() {
        this.gameStatus = 'loose';
        this.dispatchEvent('game');
        this.currentBoard = this.solution;
        this.dispatchEvent('board');
        return this.currentBoard;
    }
    revealZeros([x, y], tempBoard) {
        if (this.solution[y][x] !== 0) {
            this.gameStatus = 'cheater';
            this.dispatchEvent('game');
            const error = new Error('Cheater');
            this.dispatchEvent('error', error);
            throw error;
        }
        let workingBoard = helpers_1.cloneBoard(tempBoard || this.currentBoard);
        workingBoard[y][x] = 0;
        const around = helpers_1.coordinatesAround([x, y], this.size - 1);
        around.forEach(([xi, yi]) => {
            workingBoard[yi][xi] = this.solution[yi][xi];
        });
        around.forEach(([xi, yi]) => {
            if (this.solution[yi][xi] === 0) {
                const hasNullsAround = Boolean(helpers_1.coordinatesAround([xi, yi], this.size - 1)
                    .map(([xa, ya]) => workingBoard[ya][xa]).filter(v => v === null).length);
                if (hasNullsAround) {
                    workingBoard = this.revealZeros([xi, yi], workingBoard);
                }
            }
        });
        this.currentBoard = workingBoard;
        if (!tempBoard) {
            this.dispatchEvent('board');
        }
        return this.currentBoard;
    }
    dispatchEvent(event, error) {
        this.registeredEvents[event].forEach((callback) => {
            switch (event) {
                case 'board':
                    callback(this.currentBoard);
                case 'game':
                    callback(this.gameStatus);
                case 'error':
                    callback(error);
                default:
                    break;
            }
        });
    }
}
exports.default = Minesweeper;
//# sourceMappingURL=Minesweeper.js.map