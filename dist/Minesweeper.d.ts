declare type Move = [number, number];
declare type Board = Array<Array<number | null>>;
declare type GameStatus = 'active' | 'loose' | 'win' | 'cheater';
declare type GameLevel = 'hard' | 'medium' | 'easy';
export default class Minesweeper {
    private readonly size;
    private readonly level;
    private places;
    private mines;
    private positions;
    private solution;
    private readonly whiteBoard;
    private readonly emptyBoard;
    private gameStatus;
    private currentBoard;
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
    private dispatchEvent;
}
export {};
//# sourceMappingURL=Minesweeper.d.ts.map