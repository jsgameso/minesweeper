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
        this.places = this.size ** 2;
        const ratios = {
            easy: 0.07,
            medium: 0.15,
            hard: 0.35,
        };
        this.mines = Math.round(this.places * ratios[this.level]) + 1;
    }
    newGame(firstMove) {
        this.positions = helpers_1.random2dPositioner(this.size, this.mines, firstMove);
        const tempBoard = helpers_1.cloneBoard(this.whiteBoard);
        this.positions.forEach(([x, y]) => {
            tempBoard[x][y] = 10;
            helpers_1.coordinatesAround([x, y]).forEach(([xi, yi]) => {
                if (xi >= 0 && xi < this.size && yi >= 0 && yi < this.size && tempBoard[xi][yi] < 10) {
                    tempBoard[xi][yi] += 1;
                }
            });
        });
        this.solution = tempBoard;
        this.currentBoard = helpers_1.cloneBoard(this.emptyBoard);
        const [x, y] = firstMove;
        this.gameStatus = 'active';
        if (this.solution[x][y] === 0) {
            return this.revealZeros(firstMove);
        }
        this.currentBoard[x][y] = this.solution[x][y];
        return this.currentBoard;
    }
    reveal([x, y]) {
        if (x < 0 || x >= this.size || y < 0 || y >= this.size) {
            throw new Error('Invalid Move');
        }
        if (this.gameStatus === 'active') {
            const revealed = this.solution[x][y];
            if (revealed === 10) {
                return this.gameOver();
            }
            if (revealed === 0) {
                return this.revealZeros([x, y]);
            }
            const workingBoard = helpers_1.cloneBoard(this.currentBoard);
            workingBoard[x][y] = revealed;
            this.currentBoard = workingBoard;
            return this.currentBoard;
        }
        return this.currentBoard;
    }
    surrender() {
        return this.gameOver();
    }
    gameOver() {
        this.gameStatus = 'loose';
        this.currentBoard = this.solution;
        return this.currentBoard;
    }
    revealZeros([x, y], tempBoard) {
        if (this.solution[x][y] !== 0) {
            this.gameStatus = 'cheater';
            throw new Error('Cheater');
        }
        let workingBoard = helpers_1.cloneBoard(tempBoard || this.currentBoard);
        workingBoard[x][y] = 0;
        const around = helpers_1.coordinatesAround([x, y]);
        around.forEach(([xi, yi]) => {
            if (xi >= 0 && xi < this.size && yi >= 0 && yi < this.size) {
                workingBoard[xi][yi] = this.solution[xi][yi];
            }
        });
        around.forEach(([xi, yi]) => {
            if (xi >= 0 && xi < this.size && yi >= 0 && yi < this.size && this.solution[xi][yi] === 0) {
                const hasNullsAround = Boolean(helpers_1.coordinatesAround([xi, yi])
                    .map(([xa, ya]) => xa === -1 || ya === -1 ? 10 : workingBoard[xa][ya]).filter(v => v === null).length);
                if (hasNullsAround) {
                    workingBoard = this.revealZeros([xi, yi], workingBoard);
                }
            }
        });
        this.currentBoard = workingBoard;
        return this.currentBoard;
    }
}
exports.default = Minesweeper;
//# sourceMappingURL=Minesweeper.js.map