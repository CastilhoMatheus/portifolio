import {
  isWall,
  neighbors,
  reconstructPath,
  sameCell,
  toIndex,
  type SearchFn,
  type Cell,
} from "./grid";

export const bfs: SearchFn = (grid, start, goal) => {
  const queue = [start];
  const cameFrom = new Map<number, number>();
  const visited: Cell[] = [];
  const seen = new Set<number>([toIndex(grid, start)]);
  let head = 0;

  while (head < queue.length) {
    const current = queue[head++];
    visited.push(current);

    if (sameCell(current, goal)) {
      return { visited, path: reconstructPath(grid, cameFrom, start, goal) };
    }

    for (const next of neighbors(grid, current)) {
      if (isWall(grid, next)) continue;
      const nextIndex = toIndex(grid, next);
      if (seen.has(nextIndex)) continue;

      seen.add(nextIndex);
      cameFrom.set(nextIndex, toIndex(grid, current));
      queue.push(next);
    }
  }

  return { visited, path: null };
};
