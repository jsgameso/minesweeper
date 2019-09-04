export declare type Move = [number, number];
export declare type Board = Array<Array<number | null>>;
export declare type GameStatus = 'active' | 'loose' | 'win' | 'cheater';
export declare type GameEvent = 'board' | 'error' | 'game';
export declare type GameLevel = 'hard' | 'medium' | 'easy';
export declare type EventsCallback = ((board: Board) => void) | ((error: Error) => void) | ((status: GameStatus) => void);
export interface Solution {
    query: (x: number, y: number) => number;
    getSolution: () => Board;
}
export default class Minesweeper {
    private readonly size;
    private readonly level;
    private readonly whiteBoard;
    private readonly emptyBoard;
    private currentBoard;
    private places;
    private minesCount;
    private solution;
    private gameStatus;
    private registeredEvents;
    constructor(size?: number, level?: GameLevel);
    readonly board: Board;
    readonly status: GameStatus;
    on(event: 'board', callback: (board: Board) => void): void;
    on(event: 'error', callback: (error: Error) => void): void;
    on(event: 'game', callback: (status: GameStatus) => void): void;
    newGame(firstMove: Move): Board;
    reveal([x, y]: Move): Board;
    surrender(): Board;
    private gameOver;
    private revealZeros;
    private checkForWin;
    private dispatchEvent;
    private newSolution;
}
//# sourceMappingURL=Minesweeper.d.ts.map