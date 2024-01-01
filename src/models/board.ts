export type Generator<T> = { next: () => T };

export type Position = {
  row: number;
  col: number;
};

export type Match<T> = {
  matched: T | undefined;
  positions: Position[];
};

export type Board<T> = {
  width: number;
  height: number;
  grid: T[][];
};

export type Effect<T> = {
  kind: string;
  match?: Match<T>;
};

export type MoveResult<T> = {
  board: Board<T>;
  effects: Effect<T>[];
};

export class CyclicGenerator implements Generator<string> {
  private values: string[];
  private min: number;
  private max: number;

  constructor(values: string) {
    this.values = values.split(',');
    this.min = 0;
    this.max = this.values.length - 1;
  }

  next(): string {
    const index = Math.floor(Math.random() * (this.max - this.min + 1)) + this.min; //get random index in range
    return this.values[index];
  }
}

// This will make a deep copy of the 2D grid
export function cloneGrid<T>(grid: T[][]): T[][] {
  return grid.map((row) => [...row]);
}

export function cloneBoard<T>(board: Board<T>): Board<T> {
  return {
    grid: cloneGrid<T>(board.grid),
    height: board.height,
    width: board.width,
  };
}

export function create<T>(generator: Generator<T>, width: number, height: number): Board<T> {
  const grid: T[][] = [];
  for (let h = 0; h < height; h++) {
    let row: T[] = [];
    for (let w = 0; w < width; w++) {
      row.push(generator.next());
    }
    grid.push(row);
  }
  return {
    height,
    width,
    grid,
  };
}

export function piece<T>(board: Board<T>, p: Position): T | undefined {
  if (p.col < 0 || p.col >= board.width || p.row < 0 || p.row >= board.height) return undefined;
  return board.grid[p.row][p.col];
}

// Returns all the coordinates on the board as position objects
export function positions<T>(board: Board<T>): Position[] {
  const positions: Position[] = [];
  for (let i = 0; i < board.height; i++) {
    for (let j = 0; j < board.width; j++) {
      positions.push({ row: i, col: j });
    }
  }
  return positions;
}

export function canMove<T>(board: Board<T>, first: Position, second: Position): boolean {
  if (
    first.col < 0 ||
    first.col >= board.width ||
    first.row < 0 ||
    first.row >= board.height ||
    second.col < 0 ||
    second.col >= board.width ||
    second.row < 0 ||
    second.row >= board.height
  )
    return false;

  if (first.col === second.col && first.row === second.row) return false;

  const dx = Math.abs(first.col - second.col);
  const dy = Math.abs(first.row - second.row);

  if (dx !== 0 && dy !== 0) {
    return false;
  }

  // Make a clone of the current board
  const newBoard = cloneBoard(board);

  const firstPiece = newBoard.grid[first.row][first.col];
  const secondPiece = newBoard.grid[second.row][second.col];
  newBoard.grid[first.row][first.col] = secondPiece;
  newBoard.grid[second.row][second.col] = firstPiece;

  return checkMatches(newBoard).length > 0;
}

// Receives a grid and returns any matching tiles
export function checkMatches<T>(board: Board<T>): Match<T>[] {
  const matchingTiles: Match<T>[] = [];

  // Check horizontally for matches
  for (let i = 0; i < board.height; i++) {
    for (let j = 0; j < board.width - 2; j++) {
      if (board.grid[i][j] === board.grid[i][j + 1] && board.grid[i][j] === board.grid[i][j + 2]) {
        matchingTiles.push({
          matched: piece(board, { row: i, col: j }),
          positions: [
            { row: i, col: j },
            { row: i, col: j + 1 },
            { row: i, col: j + 2 },
          ],
        });
      }
    }
  }

  // Check vertically for matches
  for (let i = 0; i < board.height - 2; i++) {
    for (let j = 0; j < board.width; j++) {
      if (board.grid[i][j] === board.grid[i + 1][j] && board.grid[i][j] === board.grid[i + 2][j]) {
        matchingTiles.push({
          matched: piece(board, { row: i, col: j }),
          positions: [
            { row: i, col: j },
            { row: i + 1, col: j },
            { row: i + 2, col: j },
          ],
        });
      }
    }
  }

  return matchingTiles;
}

export function handleMatches<T>(
  matches: Match<T>[],
  newBoard: Board<T>,
  generator: Generator<T>,
  effects: Effect<T>[],
) {
  while (matches.length !== 0) {
    for (const match of matches) {
      effects.push({ kind: 'Match', match });

      for (let position of match.positions) {
        newBoard.grid[position.row][position.col] = null as unknown as T;
      }
    }

    fillInEmptyCells(newBoard, generator);
    effects.push({ kind: 'Refill' });

    matches = checkMatches(newBoard);
  }
}

export function move<T>(generator: Generator<T>, board: Board<T>, first: Position, second: Position): MoveResult<T> {
  if (!canMove(board, first, second)) {
    return { board, effects: [] };
  }

  // Make a clone of the current board
  const newBoard = cloneBoard(board);

  const temp = newBoard.grid[first.row][first.col];
  newBoard.grid[first.row][first.col] = newBoard.grid[second.row][second.col];
  newBoard.grid[second.row][second.col] = temp;

  let matches = checkMatches(newBoard);
  const effects: Effect<T>[] = [];

  handleMatches(matches, newBoard, generator, effects);

  return { board: newBoard, effects };
}

function getTopNumber<T>(board: Board<T>, position: Position, r = position.row - 1): T | null {
  if (r < 0) return null;

  const value = board.grid[r][position.col];
  if (value) {
    board.grid[r][position.col] = null as unknown as T;
    return value;
  }

  return getTopNumber(board, position, r - 1);
}

function fillInEmptyCells<T>(board: Board<T>, generator: Generator<T>) {
  // Drop any items that have empty cells below them
  for (let h = board.height - 1; h >= 0; h--) {
    for (let w = 0; w < board.width; w++) {
      if (!piece(board, { row: h, col: w })) board.grid[h][w] = getTopNumber(board, { row: h, col: w }) as unknown as T;
    }
  }

  // Fill in an empty cells starting from the top
  for (let h = board.height - 1; h >= 0; h--) {
    for (let w = 0; w < board.width; w++) {
      const pieceValue = piece(board, { row: h, col: w });
      if (!pieceValue) board.grid[h][w] = generator.next();
    }
  }
}
