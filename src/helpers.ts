type Move = [number, number];
type Board = Array<Array<number | null>>;

/**
 * Get random number betwwen range of min and max, (min and max also appear as result).
 *
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export const randomBetween = (min: number, max: number): number => Math.round((Math.random() * max) / (min + 1));


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
export const random2dPositioner = (size: number, count: number, ignore: Move = [0, 0]): Move[] => {
  // Create the working array
  const result: Move[] = [];

  // Count left
  let left = count;

  while (left > 0) {
    // Get random row and random column
    const row = randomBetween(0, size - 1);
    const column = randomBetween(0, size - 1);

    // Check a random true/false, if the coordinates wasn't already taken and if the coordinates aren't requested for ignore
    if (getLuck() && !(result.find(([x, y]) => x === row && y === column)) && !(row === ignore[0] && column === ignore[1])) {
      // Add the coordinate to the list
      result.push([row, column]);

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
export const coordinatesAround = ([x, y]: Move, maximum: number): Move[] => {
  return Array(8).fill([]).map((e, i) => {
    // get relative position in a 2d matrix, if the index is more than 4 means is after the center
    const position = i < 4 ? i : i + 1;
    const xi = (Math.floor(position / 3) - 1) + y;
    const yi = ((position % 3) - 1) + x;

    if (xi === -1 || xi > maximum || yi === -1 || yi > maximum) {
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
