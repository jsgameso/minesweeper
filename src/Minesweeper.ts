import { random2dPositioner, coordinatesAround, cloneBoard } from "./helpers";

export type Move = [number, number];
export type Board = Array<Array<number | null>>;
export type GameStatus = 'active' | 'loose' | 'win' | 'cheater';
export type GameEvent = 'board' | 'error' | 'game';
export type GameLevel = 'hard' | 'medium' | 'easy';
export type EventsCallback = ((board: Board) => void) | ((error: Error) => void) | ((status: GameStatus) => void);

export default class Minesweeper {
  private places: number; // How many fileds are in the board
  private mines: number; // How many mines are in the board
  private positions: [number, number][] = []; // Array of mines coordinates
  private solution: Board = []; // Revealed board
  private readonly whiteBoard: Board = Array(this.size).fill(Array(this.size).fill(0)); // Board filled with zeros
  private readonly emptyBoard: Board = Array(this.size).fill(Array(this.size).fill(null)); // Board filled with nulls
  private gameStatus: GameStatus = 'loose'; // Current Game status
  private currentBoard: Board = cloneBoard(this.emptyBoard); // Last board of the game
  private registeredEvents = { // List of registered events
    board: [] as ((board: Board) => void)[],
    error: [] as ((error: Error) => void)[],
    game: [] as ((status: GameStatus) => void)[],
  }

  /**
   * Creates an instance of Minesweeper game.
   * @param {number} [size=10]
   * @param {GameLevel} [level='medium']
   * @memberof Minesweeper
   */
  constructor(private readonly size: number = 10, private readonly level: GameLevel = 'medium') {
    // Set the places by squaring the size of the board
    this.places = this.size**2;

    // How many mines will appear in the board according to the level
    const ratios = {
      easy: 0.07, // 7 mines in a 10 * 10 board (100 fields)
      medium: 0.15, // 15 mines in a 10 * 10 board (100 fields)
      hard: 0.35, // 35 mines in a 10 * 10 board (100 fields)
    }

    // Set the ammount of mines. Add one extra to always be sure to have at least one
    this.mines = Math.round(this.places * ratios[this.level]) + 1;
  }

  /**
   * Current board.
   *
   * @readonly
   * @type {Board}
   * @memberof Minesweeper
   */
  public get board(): Board {
    return cloneBoard(this.currentBoard);
  }

  /**
   * Current Game Status.
   *
   * @readonly
   * @type {GameStatus}
   * @memberof Minesweeper
   */
  public get status(): GameStatus {
    return this.gameStatus;
  }

  /**
   * Register event listener.
   *
   * @param {GameEvent} event
   * @param {((response: GameStatus | Board | Error) => void)} callback
   * @memberof Minesweeper
   */
  public on(event: 'board', callback: (board: Board) => void): void;
  public on(event: 'error', callback: (error: Error) => void): void;
  public on(event: 'game', callback: (status: GameStatus) => void): void;
  public on(event: GameEvent, callback: EventsCallback): void {
    if (event === 'board') {
      this.registeredEvents.board.push(callback as (board: Board) => void);
    } else if (event === 'error') {
      this.registeredEvents.error.push(callback as (error: Error) => void);
    } else if (event === 'game') {
      this.registeredEvents.game.push(callback as (status: GameStatus) => void);
    }
  }

  /**
   * Start a new game with a first move.
   *
   * @param {Move} firstMove
   * @returns {Board}
   * @memberof Minesweeper
   */
  public newGame(firstMove: Move): Board {
    // Get the mine positions
    this.positions = random2dPositioner(this.size, this.mines, firstMove);

    // Create an inmutable board for the solution board
    const tempBoard = cloneBoard(this.whiteBoard);

    this.positions.forEach(([x, y]) => {
      // put the mine
      tempBoard[y][x] = 10;

      // add 1 around as a clue
      coordinatesAround([x, y], this.size).forEach(([xi, yi]) => {
        if (tempBoard[yi][xi]! < 10) {
          tempBoard[yi][xi]! += 1;
        }
      });
    });

    // Set the solution board
    this.solution = tempBoard;

    // Create a new board for the game with hidden values
    this.currentBoard = cloneBoard(this.emptyBoard);

    // Get the coordinates of the first game
    const [x, y] = firstMove;

    // Set the game status as active because is a new game
    this.gameStatus = 'active';
    this.dispatchEvent('game');

    // If the selected filed has a zero, reveal all the around values also
    if (this.solution[y][x] === 0) {
      return this.revealZeros(firstMove);
    }

    // Otherwise just reveal the field
    this.currentBoard[y][x] = this.solution[y][x];

    // Return the board and emit
    this.dispatchEvent('board');
    this.checkForWin();
    return this.currentBoard;
  }

  /**
   * Request a reveal of field.
   *
   * @param {Move} [x, y]
   * @returns {Board}
   * @memberof Minesweeper
   */
  public reveal([x, y]: Move): Board {
    if (x < 0 || x >= this.size || y < 0 || y >= this.size) {
      // If the gived coordinates are out of the limits throw an error and emit
      const error = new Error('Invalid Move');
      this.dispatchEvent('error', error);
      throw error;
    }

    // Only perform the action if the game is active
    if (this.gameStatus === 'active') {
      // Get the revealed field
      const revealed = this.solution[y][x];

      if (revealed === 10) {
        // If the revealed value was 10 means is a mine, so finish the game
        return this.gameOver();
      }

      if (revealed === 0) {
        // If the revealed value was 0, reveal all the around values also
        return this.revealZeros([x, y]);
      }

      // Otherwise just reveal the value in the current game board
      const workingBoard = cloneBoard(this.currentBoard);

      workingBoard[y][x] = revealed;

      // Save new board, return it and emit
      this.currentBoard = workingBoard;
      this.dispatchEvent('board');
      this.checkForWin();
      return this.currentBoard;
    }

    // Otherwise just reveal the last gived board
    return this.currentBoard;
  }

  /**
   * Surrender current game
   *
   * @returns {Board}
   * @memberof Minesweeper
   */
  public surrender(): Board {
    // Finish the game
    return this.gameOver();
  }

  /**
   * Finish the game
   *
   * @private
   * @returns {Board}
   * @memberof Minesweeper
   */
  private gameOver(): Board {
    // Set status to loose and emit
    this.gameStatus = 'loose';
    this.dispatchEvent('game');

    // Reveal the solution and emit
    this.currentBoard = this.solution;
    this.dispatchEvent('board');
    return this.currentBoard;
  }

  /**
   * Reveal fileds around zero field.
   *
   * @private
   * @param {Move} [x, y]
   * @param {Board} [tempBoard]
   * @returns {Board}
   * @memberof Minesweeper
   */
  private revealZeros([x, y]: Move, tempBoard?: Board): Board {
    if (this.solution[y][x] !== 0) {
      // If the gived coordinates wasn't 0 means the user is cheating, so finish the game and emit
      this.gameStatus = 'cheater';
      this.dispatchEvent('game');

      // Throw the cheater error and emit
      const error = new Error('Cheater');
      this.dispatchEvent('error', error);
      throw error;
    }

    // Create a copy of the board and place the value which is 0
    let workingBoard = cloneBoard(tempBoard || this.currentBoard);
    workingBoard[y][x] = 0;

    // Get the coordinates around
    const around = coordinatesAround([x, y], this.size);

    around.forEach(([xi, yi]) => {
      // For each around coordinate reveal the value
      workingBoard[yi][xi] = this.solution[yi][xi];
    });
   
    around.forEach(([xi, yi]) => {
      // For each around coordinate and its value is 0 reveal the around values
      if (this.solution[yi][xi] === 0) {
        // Also check if the around values are null, if isn't then it could cycle the code
        const hasNullsAround = Boolean(coordinatesAround([xi, yi], this.size)
          .map(([xa, ya]) => workingBoard[ya][xa]).filter(v => v === null).length);

        if (hasNullsAround) {
          // The second argument is to keep the already revealed values
          workingBoard = this.revealZeros([xi, yi], workingBoard);
        }
      }
    });

    // Store the final result and return it
    this.currentBoard = workingBoard;
    if (!tempBoard) {
      // If isn't a recursive instance emit the new board
      this.dispatchEvent('board');
      this.checkForWin();
    }
    return this.currentBoard;
  }

  private checkForWin() {
    const leftHidden = this.currentBoard.flat(1).filter(v => v === null).length;

    if (leftHidden === this.mines) {
      this.gameStatus = 'win';
      this.dispatchEvent('game');
    }
  }

  /**
   * Dispatch an internal event.
   *
   * @private
   * @param {GameEvent} event
   * @param {Error} [error]
   * @memberof Minesweeper
   */
  private dispatchEvent(event: 'error', error: Error): void;
  private dispatchEvent(event: 'board'): void;
  private dispatchEvent(event: 'game'): void;
  private dispatchEvent(event: GameEvent, error?: Error): void {
    if (event === 'board') {
      this.registeredEvents.board.forEach((callback) => {
        callback(this.currentBoard);
      });
    } else if (event === 'error' && error) {
      this.registeredEvents.error.forEach((callback) => {
        callback(error);
      });
    } else if (event === 'game') {
      this.registeredEvents.game.forEach((callback) => {
        callback(this.gameStatus);
      });
    }
  }
}
