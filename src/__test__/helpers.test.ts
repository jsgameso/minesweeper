import { randomBetween, getLuck, random2dPositioner, coordinatesAround, cloneBoard } from "../helpers";
import { Move, Board } from "../Minesweeper";

describe('randomBetween', () => {
  it('Should create only numbers between gived range', () => {
    const [min, max] = [3, 46];
    // One million of results
    const results: number[] = Array(1000000).fill(0).map(() => randomBetween(min, max));

    const outTheRange: number[] = results.filter(value => value < min || value > max);

    expect(outTheRange.length).toBe(0);
  });
});

describe('getLuck', () => {
  it('Should get randomly true or false', () => {
    const results: boolean[] = Array(1000000).fill(false).map(getLuck);

    const trueRatio = (results.filter(Boolean).length / 1000000).toFixed(1);
    const falseRatio = (results.filter((value) => !Boolean(value)).length / 1000000).toFixed(1);

    expect(trueRatio).toBe('0.5');
    expect(falseRatio).toBe('0.5');
  });
});

describe('random2dPositioner', () => {
  const size = 10;
  const count = (size**2) * .4;

  it('shuld create specific amount', () => {
    const positions = random2dPositioner(size, count);

    expect(positions.length).toBe(count);
  });

  it('Should create points inside the matrix', () => {
    const positions = random2dPositioner(size, count);

    const outTheRange = positions.filter(([x, y]) => x === -1 || y === -1 || x >= size || y >= size);

    expect(outTheRange.length).toBe(0);
  });

  it('Should don\'t return an ignored position', () => {
    const ignore: [number, number] = [4, 5];

    // Hundred of results
    const results = Array(10).fill([]).map(() => random2dPositioner(size, count, ignore)).flat(1);
    const outTheRange = results.filter(([x, y]) => x === ignore[0] && y === ignore[1]);

    expect(outTheRange.length).toBe(0);
  });
});

describe('coordinatesAround', () => {
  const size = 6;
  /**
   * -- Ex 1 - [1, 1]
   * [
   *  [0, 0], [1, 0], [2, 0],
   *  [0, 1], [1, 1], [2, 1],
   *  [0, 2], [1, 2], [2, 2],
   * ];
   */
  const t1: Move = [1, 1];
  const ex1: Move[] = [[0, 0], [1, 0], [2, 0], [0, 1], [2, 1], [0, 2], [1, 2], [2, 2]];

  /**
   * -- Ex 2 - [4, 4]
   * [
   *  [3, 3], [4, 3], [5, 3],
   *  [3, 4], [4, 4], [5, 4],
   *  [3, 5], [4, 5], [5, 5],
   * ];
   */
  const t2: Move = [4, 4];
  const ex2: Move[] = [[3, 3], [4, 3], [5, 3], [3, 4], [5, 4], [3, 5], [4, 5], [5, 5]];

  /**
   * -- Ex 3 - [0, 1]
   * [
   *  [0, 0], [1, 0],
   *  [0, 1], [1, 1],
   *  [0, 2], [1, 2],
   * ];
   */
  const t3: Move = [0, 1];
  const ex3: Move[] = [[0, 0], [1, 0], [1, 1], [0, 2], [1, 2]];

  /**
   * -- Ex 4 - [5, 0] (Size 6)
   * [
   *  [4, 0], [5, 0],
   *  [4, 1], [5, 1],
   * ];
   */
  const t4: Move = [5, 0];
  const ex4: Move[] = [[4, 0], [4, 1], [5, 1]];

  it('Should match with the 1st case', () => {
    const result = coordinatesAround(t1, size);

    expect(result.length).toBe(8);
    expect(result).toEqual(ex1);
  });

  it('Should match with the 2nd case', () => {
    const result = coordinatesAround(t2, size);

    expect(result.length).toBe(8);
    expect(result).toEqual(ex2);
  });

  it('Should match with the 3rd case', () => {
    const result = coordinatesAround(t3, size);

    expect(result.length).toBe(5);
    expect(result).toEqual(ex3);
  });

  it('Should match with the 4th case', () => {
    const result = coordinatesAround(t4, size);

    expect(result.length).toBe(3);
    expect(result).toEqual(ex4);
  });
});

describe('cloneBoard', () => {
  /**
   * [
   *  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
   *  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
   *  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
   *  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
   *  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
   *  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
   *  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
   *  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
   *  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
   *  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
   * ]
  */
  const board: Board = Array(10).fill(Array(10).fill(0));

  it('Should create a new pure board', () => {
    const pureBoard = cloneBoard(board);

    // Modify [3, 5]
    pureBoard[5][3] = 1;

    expect(pureBoard).not.toEqual(board);
  });
});
