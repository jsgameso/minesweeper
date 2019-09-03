import { Move, Board } from "./Minesweeper";

/**
 * Get random number betwwen range of min and max, (min and max also appear as result).
 *
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export const randomBetween = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1) + min);


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

    const exist = result.find(([x, y]) => x === column && y === column);

    // Check a random true/false, if the coordinates wasn't already taken and if the coordinates aren't requested for ignore
    if (getLuck() && !exist && !(column === ignore[0] && row === ignore[1])) {
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
export const cloneBoard = (board: Board): Board => {
  return [...board.map(r => [...r])];
}
