import { random2dPositioner, coordinatesAround, cloneBoard } from "./helpers";

type Move = [number, number];
type Board = Array<Array<number | null>>;

export default class Minesweeper {
  private places: number; // How many fileds are in the board
  private mines: number; // How many mines are in the board
  private positions: [number, number][] = []; // Array of mines coordinates
  private solution: Board = []; // Revealed board
  private readonly whiteBoard: Board = Array(this.size).fill(Array(this.size).fill(0)); // Board filled with zeros
  private readonly emptyBoard: Board = Array(this.size).fill(Array(this.size).fill(null)); // Board filled with nulls
  private gameStatus: 'active' | 'loose' | 'win' | 'cheater' = 'loose'; // Current Game status
  private currentBoard: Board = cloneBoard(this.emptyBoard); // Last board of the game

  /**
   * Creates an instance of Minesweeper game.
   * @param {number} [size=10]
   * @param {('hard' | 'medium' | 'easy')} [level='medium']
   * @memberof Minesweeper
   */
  constructor(private readonly size: number = 10, private readonly level: 'hard' | 'medium' | 'easy' = 'medium') {
    // Set the places by squaring the size of the board
    this.places = this.size**2;

    // How many mines will appear in the board according to the level
    const ratios = {
      easy: 0.07, // 7 mines in a 10 * 10 board (100 fields)
      medium: 0.15, // 15 mines in a 10 * 10 board (100 fields)
      hard: 0.35, // 35 mines in a 10 * 10 board (100 fields)
    }

    // Set the ammount of mines
    this.mines = Math.round(this.places * ratios[this.level]) + 1;
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
      tempBoard[x][y] = 10;

      // add 1 around as a clue
      coordinatesAround([x, y]).forEach(([xi, yi]) => {
        if (xi >= 0 && xi < this.size && yi >= 0 && yi < this.size && tempBoard[xi][yi]! < 10) {
          tempBoard[xi][yi]! += 1;
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

    // If the selected filed has a zero, reveal all the around values also
    if (this.solution[x][y] === 0) {
      return this.revealZeros(firstMove);
    }

    // Otherwise just reveal the field
    this.currentBoard[x][y] = this.solution[x][y];

    // Return the board
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
      // If the gived coordinates are out of the limits throw an error
      throw new Error('Invalid Move');
    }

    // Only perform the action if the game is active
    if (this.gameStatus === 'active') {
      // Get the revealed field
      const revealed = this.solution[x][y];

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

      workingBoard[x][y] = revealed;

      this.currentBoard = workingBoard;
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
    this.gameStatus = 'loose';

    this.currentBoard = this.solution;
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
    if (this.solution[x][y] !== 0) {
      // If the gived coordinates wasn't 0 means the user is cheating, so finish the game
      this.gameStatus = 'cheater';

      throw new Error('Cheater');
    }

    // Create a copy of the board and place the value which is 0
    let workingBoard = cloneBoard(tempBoard || this.currentBoard);
    workingBoard[x][y] = 0;

    // Get the coordinates around
    const around = coordinatesAround([x, y]);

    around.forEach(([xi, yi]) => {
      // For each around coordinate and it's inside the board, reveal the value
      if (xi >= 0 && xi < this.size && yi >= 0 && yi < this.size) {
        workingBoard[xi][yi] = this.solution[xi][yi]
      }
    });
   
    around.forEach(([xi, yi]) => {
      // For each around coordinate and its value is 0 reveal the around values
      if (xi >= 0 && xi < this.size && yi >= 0 && yi < this.size && this.solution[xi][yi] === 0) {
        // Also check if the around values are null, if isn't then it could cycle the code
        const hasNullsAround = Boolean(coordinatesAround([xi, yi])
          .map(([xa, ya]) => xa === -1 || ya === -1 ? 10 : workingBoard[xa][ya]).filter(v => v === null).length);

        if (hasNullsAround) {
          // The second argument is to keep the already revealed values
          workingBoard = this.revealZeros([xi, yi], workingBoard);
        }
      }
    });

    // Store the final result and return it
    this.currentBoard = workingBoard;
    return this.currentBoard;
  }
}
