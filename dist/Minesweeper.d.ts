declare type Move = [number, number];
declare type Board = Array<Array<number | null>>;
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
    constructor(size?: number, level?: 'hard' | 'medium' | 'easy');
    newGame(firstMove: Move): Board;
    reveal([x, y]: Move): Board;
    surrender(): Board;
    private gameOver;
    private revealZeros;
}
export {};
//# sourceMappingURL=Minesweeper.d.ts.map