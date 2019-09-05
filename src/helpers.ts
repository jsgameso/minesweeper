import Minesweeper, { Move } from "./Minesweeper";

/**
 * Get random number between range of min and max, (min and max also appear as result).
 *
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export const randomBetween = (min: number, max: number, ignore?: number | number[]): number => {
  let random = Math.floor(Math.random() * (max - min + 1) + min);

  if (typeof ignore === 'undefined') {
    return random;
  } else if (typeof ignore === 'number') {
    while (random === ignore) {
      random = Math.floor(Math.random() * (max - min + 1) + min);
    }

    return random;
  } else if (ignore instanceof Array && typeof ignore[0] === 'number') {
    while (ignore.indexOf(random) !== -1) {
      random = Math.floor(Math.random() * (max - min + 1) + min);
    }

    return random;
  }

  throw new Error('Invalid operation');
};


/**
 * Get true/false randomly.
 *
 * @returns {boolean}
 */
export const getLuck = (): boolean => Boolean(randomBetween(0, 1));


/**
 * Get list of random coordinates in a square.
 *
 * @param {number} size
 * @param {number} count
 * @param {Move} [ignore=[0, 0]]
 * @returns {Move[]}
 */
export const random2dPositioner = (size: number, count: number, ignore: Move = [-1, -1]): Move[] => {
  // Create the working array
  const result: Move[] = [];

  // Count left
  let left = count;

  while (left > 0) {
    // Get random row and random column
    const column = randomBetween(0, size - 1);
    const row = randomBetween(0, size - 1);

    const exist = result.find(([x, y]) => x === column && y === row);
    const isIgnored = column === ignore[0] && row === ignore[1];

    // Check a random true/false, if the coordinates wasn't already taken and if the coordinates aren't requested for ignore
    if (getLuck() && !exist && !isIgnored) {
      // Add the coordinate to the list
      result.push([column, row]);

      // And discount 1 to the left count
      left -= 1;
    }
  }

  return result;
}

/**
 * Get Array of around coordinates.
 *
 * @param {Move} [x, y]
 * @returns
 */
export const coordinatesAround = ([x, y]: Move, size: number): Move[] => {
  return Array(8).fill([]).map((e, i) => {
    // get relative position in a 2d matrix, if the index is more than 4 means is after the center
    const position = i < 4 ? i : i + 1;
    const xi = ((position % 3) - 1) + x;
    const yi = (Math.floor(position / 3) - 1) + y;

    if (xi === -1 || xi >= size || yi === -1 || yi >= size) {
      return null;
    }

    return [xi, yi];
  }).filter((coordinates) => coordinates !== null) as Move[];
}

/**
 * Create pure clone of a board.
 *
 * @param {Board} board
 * @returns {Board}
 */
export const cloneBoard = <T = (number | null)>(board: T[][]): T[][] => {
  return [...board.map(r => [...r])];
}

interface WinnerBoard {
  board: number[][];
  bombs: Move[];
  numbers: {
    1: Move[];
    2: Move[];
    3: Move[];
    4: Move[];
    5: Move[];
    6: Move[];
    7: Move[];
    8: Move[];
  };
  zeros: Move[];
}


/**
 * Create a winner board with descriptive values.
 *
 * @param {number} size
 * @param {number} bombsCount
 * @param {Move} ignore
 * @returns {WinnerBoard}
 */
export const createWinnerBoard = (size: number, bombsCount: number, ignore?: Move): WinnerBoard => {
  const bombs: Move[] = random2dPositioner(size, bombsCount, ignore);

  const board = Minesweeper.emptyBoard<number>(size, 0);
  
  bombs.forEach(([x, y]) => {
    // put the mine
    board[y][x] = 10;

    // add 1 around as a clue
    coordinatesAround([x, y], size).forEach(([xi, yi]) => {
      if (board[yi][xi]! < 10) {
        board[yi][xi]! += 1;
      }
    });
  });

  const zeros: Move[] = [];
  const numbers = {
    1: [] as Move[],
    2: [] as Move[],
    3: [] as Move[],
    4: [] as Move[],
    5: [] as Move[],
    6: [] as Move[],
    7: [] as Move[],
    8: [] as Move[],
  }

  board.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === 0) {
        zeros.push([x, y]);
      } else if (cell < 9) {
        numbers[cell as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8].push([x, y]);
      }
    });
  });

  return {
    board,
    bombs,
    numbers,
    zeros,
  }
}
