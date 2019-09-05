"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
class Minesweeper {
    constructor(size = 10, level = 'medium', winnerBoard) {
        this.size = size;
        this.level = level;
        this.winnerBoard = winnerBoard;
        this.currentBoard = Minesweeper.emptyBoard(this.size);
        this.solution = this.newSolution();
        this.gameStatus = 'loose';
        this.registeredEvents = {
            board: [],
            error: [],
            game: [],
        };
        const ratios = {
            easy: 0.07,
            medium: 0.15,
            hard: 0.35,
        };
        this.minesCount = Math.round(this.size ** 2 * ratios[this.level]) + 1;
    }
    static emptyBoard(size, fillWith) {
        const filled = typeof fillWith === 'undefined' ? null : fillWith;
        return helpers_1.cloneBoard(Array(size).fill(Array(size).fill(filled)));
    }
    get board() {
        return helpers_1.cloneBoard(this.currentBoard);
    }
    get status() {
        const status = this.gameStatus;
        return status;
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
        else {
            throw new Error('Invalid Event');
        }
    }
    newGame(firstMove) {
        this.solution = this.newSolution(firstMove);
        const [x, y] = firstMove;
        this.gameStatus = 'active';
        this.dispatchEvent('game');
        if (this.solution.query(x, y) === 0) {
            return this.revealZeros(firstMove);
        }
        this.currentBoard[y][x] = this.solution.query(x, y);
        this.dispatchEvent('board');
        this.checkForWin();
        return this.currentBoard;
    }
    reveal([x, y]) {
        if (x < 0 || x >= this.size || y < 0 || y >= this.size) {
            const error = new Error('Invalid Move');
            this.dispatchEvent('error', error);
            throw error;
        }
        if (this.gameStatus === 'active') {
            const revealed = this.solution.query(x, y);
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
            this.checkForWin();
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
        this.currentBoard = this.solution.getSolution();
        this.dispatchEvent('board');
        return this.currentBoard;
    }
    revealZeros([x, y], tempBoard) {
        if (this.solution.query(x, y) !== 0) {
            this.gameStatus = 'cheater';
            this.dispatchEvent('game');
            const error = new Error('Cheater');
            this.dispatchEvent('error', error);
            throw error;
        }
        let workingBoard = helpers_1.cloneBoard(tempBoard || this.currentBoard);
        workingBoard[y][x] = 0;
        const around = helpers_1.coordinatesAround([x, y], this.size);
        const aroundResults = around.map(([xi, yi]) => {
            const value = this.solution.query(xi, yi);
            workingBoard[yi][xi] = value;
            return [xi, yi, value];
        });
        aroundResults.forEach(([xi, yi, value]) => {
            if (value === 0) {
                const hasNullsAround = Boolean(helpers_1.coordinatesAround([xi, yi], this.size)
                    .map(([xa, ya]) => workingBoard[ya][xa]).filter(v => v === null).length);
                if (hasNullsAround) {
                    workingBoard = this.revealZeros([xi, yi], workingBoard);
                }
            }
        });
        this.currentBoard = workingBoard;
        if (!tempBoard) {
            this.dispatchEvent('board');
            this.checkForWin();
        }
        return this.currentBoard;
    }
    checkForWin() {
        const leftHidden = this.currentBoard.flat(1).filter(v => v === null).length;
        if (leftHidden === this.minesCount) {
            this.gameStatus = 'win';
            this.dispatchEvent('game');
        }
    }
    dispatchEvent(event, error) {
        if (event === 'board') {
            this.registeredEvents.board.forEach((callback) => {
                callback(this.currentBoard);
            });
        }
        else if (event === 'error' && error) {
            this.registeredEvents.error.forEach((callback) => {
                callback(error);
            });
        }
        else if (event === 'game') {
            this.registeredEvents.game.forEach((callback) => {
                callback(this.gameStatus);
            });
        }
    }
    newSolution(firstMove) {
        const solution = this.winnerBoard || Minesweeper.emptyBoard(this.size, 0);
        const positions = helpers_1.random2dPositioner(this.size, this.minesCount, firstMove);
        this.currentBoard = Minesweeper.emptyBoard(this.size);
        if (!this.winnerBoard) {
            positions.forEach(([x, y]) => {
                solution[y][x] = 10;
                helpers_1.coordinatesAround([x, y], this.size).forEach(([xi, yi]) => {
                    if (solution[yi][xi] < 10) {
                        solution[yi][xi] += 1;
                    }
                });
            });
        }
        const looseTheGame = () => {
            this.gameStatus = 'loose';
            this.dispatchEvent('game');
            return helpers_1.cloneBoard(solution);
        };
        let queryCount = 0;
        return {
            getSolution: () => {
                return looseTheGame();
            },
            query: (x, y) => {
                if (queryCount > 9 && !this.winnerBoard) {
                    this.gameStatus = 'cheater';
                    this.dispatchEvent('game');
                    const error = new Error('Cheater');
                    this.dispatchEvent('error', error);
                    throw error;
                }
                const value = solution[y][x];
                if (value === 10) {
                    looseTheGame();
                    return 10;
                }
                if (value !== 0) {
                    queryCount += 1;
                    setTimeout(() => { queryCount -= 1; }, 50);
                }
                else {
                    queryCount = 0;
                }
                return value;
            }
        };
    }
}
exports.default = Minesweeper;
//# sourceMappingURL=Minesweeper.js.map