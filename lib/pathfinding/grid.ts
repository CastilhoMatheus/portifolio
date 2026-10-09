/**
 * Shared grid types and helpers for the pathfinding algorithms.
 * The algorithms (bfs.ts, astar.ts) only depend on this file, never on the UI.
 */

export type Cell = { row: number; col: number };

export type Grid = {
  rows: number;
  cols: number;
  /** walls[row * cols + col] === 1 means that cell is blocked. */
  walls: Uint8Array;
};

export type SearchResult = {
  /** Every cell the algorithm expanded, in the order it expanded them (drives the animation). */
  visited: Cell[];
  /** Cells from start to goal, both included. null when the goal can't be reached. */
  path: Cell[] | null;
};

export type SearchFn = (grid: Grid, start: Cell, goal: Cell) => SearchResult;

export function createGrid(
  rows: number,
  cols: number,
  walls: Cell[] = [],
): Grid {
  const grid: Grid = { rows, cols, walls: new Uint8Array(rows * cols) };
  for (const cell of walls) grid.walls[toIndex(grid, cell)] = 1;
  return grid;
}

/** Turns a cell into a single number, handy as a key for arrays, Sets and Maps. */
export function toIndex(grid: Grid, cell: Cell): number {
  return cell.row * grid.cols + cell.col;
}

export function fromIndex(grid: Grid, index: number): Cell {
  return { row: Math.floor(index / grid.cols), col: index % grid.cols };
}

export function inBounds(grid: Grid, cell: Cell): boolean {
  return (
    cell.row >= 0 &&
    cell.row < grid.rows &&
    cell.col >= 0 &&
    cell.col < grid.cols
  );
}

export function isWall(grid: Grid, cell: Cell): boolean {
  return grid.walls[toIndex(grid, cell)] === 1;
}

export function sameCell(a: Cell, b: Cell): boolean {
  return a.row === b.row && a.col === b.col;
}

/** Up, right, down, left: the order matters for deterministic results. */
const DIRECTIONS: ReadonlyArray<Cell> = [
  { row: -1, col: 0 },
  { row: 0, col: 1 },
  { row: 1, col: 0 },
  { row: 0, col: -1 },
];

/** The walkable cells next to `cell` (4 directions, no diagonals, no walls). */
export function neighbors(grid: Grid, cell: Cell): Cell[] {
  const result: Cell[] = [];
  for (const d of DIRECTIONS) {
    const next = { row: cell.row + d.row, col: cell.col + d.col };
    if (inBounds(grid, next) && !isWall(grid, next)) result.push(next);
  }
  return result;
}

/** Distance if there were no walls. A*'s heuristic on a 4-direction grid. */
export function manhattan(a: Cell, b: Cell): number {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

/**
 * Walk back from `goal` through `cameFrom` (index → previous index) to rebuild the path.
 * Both BFS and A* end with this.
 */
export function reconstructPath(
  grid: Grid,
  cameFrom: Map<number, number>,
  start: Cell,
  goal: Cell,
): Cell[] {
  const path: Cell[] = [goal];
  let current = toIndex(grid, goal);
  const startIndex = toIndex(grid, start);
  while (current !== startIndex) {
    const previous = cameFrom.get(current);
    if (previous === undefined) throw new Error("Broken cameFrom chain");
    current = previous;
    path.push(fromIndex(grid, current));
  }
  return path.reverse();
}
