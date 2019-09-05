import Minesweeper, { Board, GameStatus, Move } from '../Minesweeper';
import { randomBetween, createWinnerBoard, coordinatesAround } from '../helpers';

describe('Minesweeper', () => {
  let target: Minesweeper;

  beforeEach(() => {
    target = new Minesweeper();
  });

  it('Shoud create an empty board', () => {
    const size = randomBetween(1, 30);
    const types = ['string', 1, true, null];
    const randomType = types[randomBetween(0, 3)];
    const board = Minesweeper.emptyBoard(size, randomType);

    expect(board.length).toBe(size);
    board.forEach((row) => {
      expect(row.length).toBe(size);

      row.forEach((cell) => {
        expect(typeof cell).toBe(typeof randomType);
      });
    });
  });

  it('Should get current game board', () => {
    // @ts-ignore
    expect(target.board).not.toBe(target.currentBoard);
    // @ts-ignore
    expect(target.board).toEqual(target.currentBoard);
  });

  it('Should get current game status', () => {
    // @ts-ignore
    expect(target.status).toEqual(target.gameStatus);
  });

  it('Should store event listeners', () => {
    const boardListener = (board: Board) => {};
    const errorListener = (error: Error) => {};
    const gameListener = (status: GameStatus) => {};

    target.on('board', boardListener);
    target.on('error', errorListener);
    target.on('game', gameListener);

    // @ts-ignore
    expect(target.registeredEvents).toHaveProperty('board');
    // @ts-ignore
    expect(target.registeredEvents).toHaveProperty('error');
    // @ts-ignore
    expect(target.registeredEvents).toHaveProperty('game');

    // @ts-ignore
    expect(target.registeredEvents.board).toContain(boardListener);
    // @ts-ignore
    expect(target.registeredEvents.error).toContain(errorListener);
    // @ts-ignore
    expect(target.registeredEvents.game).toContain(gameListener);
  });

  it('Should throw error if invalid event listener was provided', () => {
    const error = new Error('Invalid Event');

    // @ts-ignore
    expect(() => target.on('fake', jest.fn())).toThrowError(error);
  });

  it('Should set new game and if zero was pressed reveal zeros around', () => {
    const size = 10;
    const bombsCount = Math.round((size**2) * .15) + 1;
    const winnerBoard = createWinnerBoard(size, bombsCount);
    const move: Move = [winnerBoard.zeros[0][0], winnerBoard.zeros[0][1]];

    target = new Minesweeper(size, 'medium', winnerBoard.board);
    // @ts-ignore
    jest.spyOn(target, 'revealZeros');
    
    target.newGame(move);
    
    // @ts-ignore
    expect(target.revealZeros).toHaveBeenCalledWith(move);
  });

  it('Should set new game and if a value was pressed reveal only the value', () => {
    const size = 10;
    const bombsCount = Math.round((size**2) * .15) + 1;
    const winnerBoard = createWinnerBoard(size, bombsCount);
    const emptyNumbers = Object.keys(winnerBoard.numbers).filter((number) =>
      winnerBoard.numbers[Number(number)].length === 0).map(Number);
    const expectedNumber = randomBetween(1, 8, emptyNumbers);
    const move: Move = [winnerBoard.numbers[expectedNumber][0][0], winnerBoard.numbers[expectedNumber][0][1]];
    const boardListener = jest.fn();

    target = new Minesweeper(size, 'medium', winnerBoard.board);
    // @ts-ignore
    jest.spyOn(target, 'checkForWin');

    target.on('board', boardListener);
    target.newGame(move);

    // @ts-ignore
    expect(target.checkForWin).toHaveBeenCalledTimes(1);
    expect(boardListener).toHaveBeenCalledWith(target.board);
    expect(target.board[move[1]][move[0]]).toBe(expectedNumber);
    coordinatesAround(move, size).forEach(([x, y]) => {
      expect(target.board[y][x]).toBe(null);
    });
  });

  it('Should throw an error if an invalid position has gived', () => {
    const move: Move = [10, 10];
    const error = new Error('Invalid Move');
    const errorListener = jest.fn();

    target.on('error', errorListener);
    target.newGame([0, 0]);

    expect(() => target.reveal(move)).toThrowError(error);
    expect(errorListener).toHaveBeenCalledWith(error);
  });

  it('Should finish the game if a bomb (10) is revealed', () => {
    const size = 10;
    const bombsCount = Math.round((size**2) * .15) + 1;
    const winnerBoard = createWinnerBoard(size, bombsCount);

    target = new Minesweeper(size, 'medium', winnerBoard.board);
    // @ts-ignore
    jest.spyOn(target, 'gameOver');

    target.newGame(winnerBoard.zeros[0]);
    target.reveal(winnerBoard.bombs[0]);

    // @ts-ignore
    expect(target.gameOver).toHaveBeenCalled();
  });

  it('Should reveal zeros if a zero is revealed', () => {
    const size = 10;
    const bombsCount = Math.round((size**2) * .15) + 1;
    const winnerBoard = createWinnerBoard(size, bombsCount);
    const emptyNumbers = Object.keys(winnerBoard.numbers).filter((number) =>
      winnerBoard.numbers[Number(number)].length === 0).map(Number);
    const expectedNumber = randomBetween(1, 8, emptyNumbers);
    const move: Move = [winnerBoard.numbers[expectedNumber][0][0], winnerBoard.numbers[expectedNumber][0][1]];

    target = new Minesweeper(size, 'medium', winnerBoard.board);
    // @ts-ignore
    jest.spyOn(target, 'revealZeros');

    target.newGame(move);
    target.reveal(winnerBoard.zeros[0]);

    // @ts-ignore
    expect(target.revealZeros).toHaveBeenCalled();
  });

  it('Should reveal a number', () => {
    const size = 10;
    const bombsCount = Math.round((size**2) * .15) + 1;
    const winnerBoard = createWinnerBoard(size, bombsCount);
    const emptyNumbers = Object.keys(winnerBoard.numbers).filter((number) =>
      winnerBoard.numbers[Number(number)].length === 0).map(Number);
    const expectedNumber = randomBetween(1, 8, emptyNumbers);
    const boardListener = jest.fn();
    const move: Move = [winnerBoard.numbers[expectedNumber][0][0], winnerBoard.numbers[expectedNumber][0][1]];

    target = new Minesweeper(size, 'medium', winnerBoard.board);
    // @ts-ignore
    jest.spyOn(target, 'checkForWin');
    target.on('board', boardListener);

    target.newGame(winnerBoard.zeros[0]);
    target.reveal(move);

    // @ts-ignore
    expect(target.checkForWin).toHaveBeenCalled();
    expect(target.board[move[1]][move[0]]).toBe(expectedNumber);
    expect(boardListener).toHaveBeenCalledWith(target.board);
  });

  it('Should return the result if the game isn\'t active', () => {
    const size = 10;
    const bombsCount = Math.round((size**2) * .15) + 1;
    const winnerBoard = createWinnerBoard(size, bombsCount);
    const move: Move = [randomBetween(0, 9), randomBetween(0, 9)];

    target = new Minesweeper(size, 'medium', winnerBoard.board);

    target.newGame(winnerBoard.zeros[0]);
    target.surrender();

    expect(target.reveal(move)).toEqual(winnerBoard.board);
  });

  it('Should fire gameOver() on surrender()', () => {
    // @ts-ignore
    jest.spyOn(target, 'gameOver');
    
    target.surrender();
    
    // @ts-ignore
    expect(target.gameOver).toHaveBeenCalled();
  });

  it('Should loose the game, and return the results', () => {
    const gameListener = jest.fn();
    const boardListener = jest.fn();
    const size = 10;
    const bombsCount = Math.round((size**2) * .15) + 1;
    const winnerBoard = createWinnerBoard(size, bombsCount);
    const emptyNumbers = Object.keys(winnerBoard.numbers).filter((number) =>
      winnerBoard.numbers[Number(number)].length === 0).map(Number);
    const expectedNumber = randomBetween(1, 8, emptyNumbers);
    const move: Move = [winnerBoard.numbers[expectedNumber][0][0], winnerBoard.numbers[expectedNumber][0][1]];

    target = new Minesweeper(size, 'medium', winnerBoard.board);
    target.on('board', boardListener);
    target.on('game', gameListener);

    target.newGame(move);

    // @ts-ignore
    expect(target.gameOver()).toEqual(winnerBoard.board);
    expect(target.board).toEqual(winnerBoard.board);
    expect(gameListener).toHaveBeenCalledWith('loose');
    expect(boardListener).toHaveBeenCalledWith(winnerBoard.board);
    expect(target.status).toBe('loose');
  });

  it('Should throw a cheater error if reveal zero is called with non zero value', () => {
    const error = new Error('Cheater');
    const gameListener = jest.fn();
    const errorListener = jest.fn();
    const size = 10;
    const bombsCount = Math.round((size**2) * .15) + 1;
    const winnerBoard = createWinnerBoard(size, bombsCount);
    const emptyNumbers = Object.keys(winnerBoard.numbers).filter((number) =>
      winnerBoard.numbers[Number(number)].length === 0).map(Number);
    const expectedNumber = randomBetween(1, 8, emptyNumbers);
    const move: Move = [winnerBoard.numbers[expectedNumber][0][0], winnerBoard.numbers[expectedNumber][0][1]];

    target = new Minesweeper(size, 'medium', winnerBoard.board);
    target.on('error', errorListener);
    target.on('game', gameListener);

    target.newGame(winnerBoard.zeros[0]);

    // @ts-ignore
    expect(() => target.revealZeros(move)).toThrowError(error);
    expect(gameListener).toHaveBeenCalledWith('cheater');
    expect(errorListener).toHaveBeenCalledWith(error);
  });

  it('Should reveal values around zero', () => {
    const gameListener = jest.fn();
    const size = 10;
    const bombsCount = Math.round((size**2) * .15) + 1;
    const winnerBoard = createWinnerBoard(size, bombsCount);
    const move: Move = [winnerBoard.zeros[0][0], winnerBoard.zeros[0][1]];

    target = new Minesweeper(size, 'medium', winnerBoard.board);
    target.on('board', gameListener);
    // @ts-ignore
    jest.spyOn(target, 'checkForWin');

    target.newGame(move);
    
    // @ts-ignore
    expect(target.checkForWin).toHaveBeenCalledTimes(1);
    expect(gameListener).toHaveBeenCalledTimes(1);
    expect(gameListener).toHaveBeenCalledWith(target.board);
    coordinatesAround(move, size).forEach(([x, y]) => {
      expect(target.board[y][x]).toEqual(winnerBoard.board[y][x]);
    });
  });

  it('Should reveal all the near zeros', () => {
    const size = 10;
    const bombsCount = Math.round((size**2) * .15) + 1;
    const winnerBoard = createWinnerBoard(size, bombsCount);
    const zeroGroups: Move[][] = [];
    winnerBoard.zeros.forEach(([x, y]) => {
      if (zeroGroups.length === 0) {
        zeroGroups.push([[x, y]]);
      } else {
        let groupIx;

        coordinatesAround([x, y], size).forEach(([xa, ya]) => {
          if (!groupIx) {
            zeroGroups.forEach((group, gi) => {
              if (!groupIx && group.find(([xg, yg]) => xa === xg && ya === yg)) {
                groupIx = gi;
              }
            });
          }
        });

        if (!groupIx) {
          zeroGroups.push([[x, y]]);
        } else {
          zeroGroups[groupIx].push([x, y]);
        }
      }
    });
    const workingGroup = zeroGroups.sort((a, b) => b.length - a.length)[0];
    const move: Move = [workingGroup[0][0], workingGroup[0][1]];

    target = new Minesweeper(size, 'medium', winnerBoard.board);

    target.newGame(move);

    workingGroup.forEach((zero) => {
      coordinatesAround(zero, size).forEach(([x, y]) => {
        expect(target.board[y][x]).toBe(winnerBoard.board[y][x]);
      });
    });
  });

  it('Should check for winning each move and new game', () => {
    const size = 10;
    const bombsCount = Math.round((size**2) * .15) + 1;
    const winnerBoard = createWinnerBoard(size, bombsCount);
    const numbersInBoard = Object.keys(winnerBoard.numbers).map((n) => winnerBoard.numbers[Number(n)])
      .filter((n) => n instanceof Array && n.length > 0).flat(1);
    const movesCount = randomBetween(1, 8);
    
    target = new Minesweeper(size, 'medium', winnerBoard.board);
    // @ts-ignore
    jest.spyOn(target, 'checkForWin');

    target.newGame(numbersInBoard[0]);

    for (let index = 1; index <= movesCount; index += 1) {
      target.reveal(numbersInBoard[index]);
    }

    // @ts-ignore
    expect(target.checkForWin).toHaveBeenCalledTimes(movesCount + 1);
  });

  it('Should win the game if all the non bombs fields are revealed', () => {
    const size = 10;
    const bombsCount = Math.round((size**2) * .15) + 1;
    const winnerBoard = createWinnerBoard(size, bombsCount);
    const numbersInBoard: Move[] = Object.keys(winnerBoard.numbers).map((n) => winnerBoard.numbers[Number(n)])
      .filter((n) => n instanceof Array && n.length > 0).flat(1);
    const gameListener = jest.fn();
    
    target = new Minesweeper(size, 'medium', winnerBoard.board);
    target.on('game', gameListener);

    target.newGame(winnerBoard.zeros[0]);

    winnerBoard.zeros.forEach((zero) => {
      target.reveal(zero);
    });
    numbersInBoard.forEach((number) => {
      target.reveal(number);
    });

    expect(gameListener).toHaveBeenCalledWith('win');
  });

  it('Should dispatch events', () => {
    const boardListener = jest.fn();
    const errorListener = jest.fn();
    const gameListener = jest.fn();
    const fakeError = new Error('Fake Error');

    target.on('board', boardListener);
    target.on('error', errorListener);
    target.on('game', gameListener);

    // @ts-ignore
    target.dispatchEvent('board');
    // @ts-ignore
    target.dispatchEvent('error', fakeError);
    // @ts-ignore
    target.dispatchEvent('game');

    expect(boardListener).toHaveBeenCalled();
    expect(errorListener).toHaveBeenCalledWith(fakeError);
    expect(gameListener).toHaveBeenCalled();
  });

  it('Should not do anything if an invalid event is dispatched', () => {
    const boardListener = jest.fn();
    const errorListener = jest.fn();
    const gameListener = jest.fn();

    target.on('board', boardListener);
    target.on('error', errorListener);
    target.on('game', gameListener);

    // @ts-ignore
    target.dispatchEvent('fake');

    expect(boardListener).not.toHaveBeenCalled();
    expect(errorListener).not.toHaveBeenCalled();
    expect(gameListener).not.toHaveBeenCalled();
  });

  it('Should create a new solution object', () => {
    // @ts-ignore
    const solutionObject = target.newSolution();

    expect(solutionObject.getSolution).toBeDefined();
    expect(solutionObject.query).toBeDefined();
  });

  it('Should loose the game if the solution is requested', () => {
    const gameListener = jest.fn();

    target.on('game', gameListener);
    target.newGame([0, 0]);

    // @ts-ignore
    target.solution.getSolution();

    expect(gameListener).toHaveBeenCalledWith('loose');
  });

  it('Should return a value on query', () => {
    const size = 10;
    const bombsCount = Math.round((size**2) * .15) + 1;
    const winnerBoard = createWinnerBoard(size, bombsCount);
    const emptyNumbers = Object.keys(winnerBoard.numbers).filter((number) =>
      winnerBoard.numbers[Number(number)].length === 0).map(Number);
    const expectedNumber = randomBetween(1, 8, emptyNumbers);
    const [x, y]: Move = [winnerBoard.numbers[expectedNumber][0][0], winnerBoard.numbers[expectedNumber][0][1]];

    target = new Minesweeper(size, 'medium', winnerBoard.board);
    target.newGame([x, y]);

    // @ts-ignore
    expect(target.solution.query(x, y)).toBe(winnerBoard.board[y][x]);
  });

  it('Should throw cheater error if try to broute force in the solution query', () => {
    let move: Move;
    const error = new Error('Cheater');
    const errorListener = jest.fn();
    const moves = 10;

    while (!move) {
      target.newGame([4, 5]);
      
      if (target.board[5][4] !== 10 && target.board[5][4] !== 0) {
        target.on('error', errorListener);
        move = [4, 5];
      }
    }

    for (let index = 0; index < moves; index += 1) {
      if (index === 8) {
        expect(() => target.reveal(move)).toThrowError(error);
      } else {
        target.reveal(move);
      }
    }
    expect(errorListener).toHaveBeenCalledWith(error);
  });

  it('Should happen 50ms between each move', async () => {
    let move: Move;
    const error = new Error('Cheater');
    const errorListener = jest.fn();
    const moves = randomBetween(10, 100);

    const wait60ms = () => new Promise((resolve) => {
      setTimeout(() => { resolve() }, 60);
    });

    while (!move) {
      target.newGame([4, 5]);
      
      if (target.board[5][4] !== 10 && target.board[5][4] !== 0) {
        target.on('error', errorListener);
        move = [4, 5];
      }
    }

    for (let index = 0; index < moves; index += 1) {
      target.reveal(move);
      await wait60ms();
    }

    expect(errorListener).not.toHaveBeenCalledWith(error);
  });

  it('Should loose the game if a 10 is revealed', () => {
    const size = 10;
    const bombsCount = Math.round((size**2) * .15) + 1;
    const winnerBoard = createWinnerBoard(size, bombsCount);
    const [x, y]: Move = [winnerBoard.bombs[0][0], winnerBoard.bombs[0][1]];
    const gameListener = jest.fn();

    target = new Minesweeper(size, 'medium', winnerBoard.board);
    target.on('game', gameListener);
    target.newGame(winnerBoard.zeros[0]);
    target.reveal([x, y]);

    expect(gameListener).toHaveBeenCalledWith('loose');
  });
});
