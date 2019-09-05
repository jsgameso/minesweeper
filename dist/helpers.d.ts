import { Move } from "./Minesweeper";
export declare const randomBetween: (min: number, max: number, ignore?: number | number[] | undefined) => number;
export declare const getLuck: () => boolean;
export declare const random2dPositioner: (size: number, count: number, ignore?: [number, number]) => [number, number][];
export declare const coordinatesAround: ([x, y]: [number, number], size: number) => [number, number][];
export declare const cloneBoard: <T = number | null>(board: T[][]) => T[][];
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
export declare const createWinnerBoard: (size: number, bombsCount: number, ignore?: [number, number] | undefined) => WinnerBoard;
export {};
//# sourceMappingURL=helpers.d.ts.map