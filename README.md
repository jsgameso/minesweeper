# Minesweeper

JS Engine for Minesweeper game. Powered by JS with Typescript and 0 dependencies. It can be implemented in any UI engine with JS support like React, React-Native, Vue, Angular, Electron, even CLI.

> A CLI built in coming soon

Go ahead and include it in your proyect as something funny for your users. Is MIT licenced.

## Install

```sh
yarn add @jsgames/minesweeper
```

> It include its own type definition, you don't need to install something like @types/...

## Usage

```typescript
import Minesweeper, { Board } from '@jsgames/minesweeper';

// Get an empty board to draw in my UI
const emptyBoard = Minesweeper.emptyBoard<null>(10, null);

// create a new instance for the game
const game = new Minesweeper();

// start new game with a new position (This is to avoid click a bomb in the first move)
let board: Board = game.newGame([4, 5]);

// get the game status
let gameStatus = game.status; // active

// make a move and update the board and the game status
board = game.reveal([5, 5]);
gameStatus = game.status; // Lets assume you click a bomb, then the status will be loose
```

Also for more responsive behavior listeners can be setted

```typescript
import Minesweeper, { Board, GameStatus } from '@jsgames/minesweeper';

const onBoard = (board: Board) => updateTheBoard(board);
const onGame = (status: GameStatus) => updateGameStatus(status);
const onError = (error: Error) => handleErrors(error);

const game = new Minesweeper();

// If a new board is created, it dispatch with the last board
game.on('board', onBoard);
// If the game status change, it dispatch with the last game status
game.on('game', onGame);
// If the an error happen in the game, it dispatch the error
game.on('error', onError);
```

## API

### `class Minesweeper([size = 10, level = 'medium']): Minesweeper`

Class of the game engine, return a [`Minesweeper`]() instance.

|Argument|Required|Default|Type|Description
|---|:-:|:-:|:-:|---|
|**size**|`false`|`10`|`number`|Size of the board|
|**level**|`false`|`medium`|[`GameLevel`](#GameLevel)|Level to define mines count|
|*WARNING* **winnerBoard**|`false`||[`Board`](#Board)|Set a winner board for experimental uses, can be get by [createWinnerBoard().board](https://github.com/jsgameso/minesweeper/blob/master/src/helpers.ts#L133)|

### `Minesweeper.emptyBoard<[T]>(size[, fillWith]): T[][]`

Static method to create an empty board with a given fill and type. Returns a [`Board`](#Board) like but with a specific type.

|Argument|Required|Default|Type|Description
|---|:-:|:-:|:-:|---|
|**`type` T**|`false`|`null`||Type definition of the fields|
|**size**|`true`||`number`|Size of the board|
|**fillWith**|`false`|`null`|`T`|Values to fill with|

### `Minesweeper.prototype.board: `[`Board`](#Board)

Property to get the last board of the current game. Return [`Board`](#Board).

### `Minesweeper.prototype.status: `[`GameStatus`](#GameStatus)

Property to get the current game status. Return [`GameStatus`](#GameStatus).

### `Minesweeper.prototype.on(eventType: `[`GameEvent`](#GameEvent)`, callback: `[`EventsCallback`](#EventsCallback)`): void`

Instance method to suscribe an event listener. Those events could be:

- `'board'`: Event when the current game board change.
- `'game'`: Event when the game status change.
- `'error'`: Event when an error is throw.

|Argument|Required|Default|Type|Description
|---|:-:|:-:|:-:|---|
|**eventType**|`true`||[`GameEvent`](#GameEvent)|Event name to suscribe|
|**callback**|`true`||[`EventsCallback`](#EventsCallback)|Callback function to execute once the event is fired|

### `Minesweeper.prototype.newGame(firstMove: `[`Move`](#Move)`): `[`Board`](#Board)

Instance method to create a new game with a first revel to avoid press a bomb in the first move by accident. It return a new [`Board`](#Board) with the move revealed. And emit the `'board'` and `'game'` events.

|Argument|Required|Default|Type|Description
|---|:-:|:-:|:-:|---|
|**firstMove**|`true`||[`Move`](#Move)|Coordinates [x, y] of the first move|

### `Minesweeper.prototype.reveal(move: `[`Move`](#Move)`): `[`Board`](#Board)

Instance method to reveal a specific point in the game board, if the point is a bomb, the game event will be called with `'loose'` and the method will return the [`Board`](#Board) resolved; if the point is a `0` the method will return the [`Board`](#Board) with all the values around the `0` and recursiveley.

|Argument|Required|Default|Type|Description
|---|:-:|:-:|:-:|---|
|**move**|`true`||[`Move`](#Move)|Coordinates [x, y] of the move|

### `Minesweeper.prototype.surrender(): `[`Board`](#Board)

Instance method to surrender in the game, it will call the `'game'` method with `'loose'`. Also will return the [`Board`](#Board) resolved.

## Types

### `Move`

Type who define how a move should be: An array with x and y coordinates

**`[number, number]`**

### `Board`

Type who define how a board should be: An 2D array containing `number` or `null`;

**`Array<Array<number | null>>`**

A board returned by a newGame() looks like (If the size is 10 and the first move is `[3, 4]`):

|||||||||||
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|`null`|`null`|`null`|`null`|`null`|`null`|`null`|`null`|`null`|`null`|
|`null`|`null`|`null`|`null`|`null`|`null`|`null`|`null`|`null`|`null`|
|`null`|`null`|`null`|`null`|`null`|`null`|`null`|`null`|`null`|`null`|
|`null`|`null`|`null`|`null`|`null`|`null`|`null`|`null`|`null`|`null`|
|`null`|`null`|`null`|`1`|`null`|`null`|`null`|`null`|`null`|`null`|
|`null`|`null`|`null`|`null`|`null`|`null`|`null`|`null`|`null`|`null`|
|`null`|`null`|`null`|`null`|`null`|`null`|`null`|`null`|`null`|`null`|
|`null`|`null`|`null`|`null`|`null`|`null`|`null`|`null`|`null`|`null`|
|`null`|`null`|`null`|`null`|`null`|`null`|`null`|`null`|`null`|`null`|
|`null`|`null`|`null`|`null`|`null`|`null`|`null`|`null`|`null`|`null`|

### `GameStatus`

Type who define the different Game Status

**`'active' | 'loose' | 'win' | 'cheater'`**

### `GameEvent`

Type who define the different Game Events

**`'board' | 'error' | 'game'`**

### `GameLevel`

Type who define the different Game Levels

**`'hard' | 'medium' | 'easy'`**

### `EventsCallback`

Type who define the different Events Callbacks

**`((board: Board) => void) | ((error: Error) => void) | ((status: GameStatus) => void)`**

### `Solution`

Solution object to query result

```typescript
interface {
  query: (x: number, y: number) => number;
  getSolution: () => Board;
}
```

## Licence

[MIT](https://github.com/jsgameso/minesweeper/blob/master/LICENSE)
