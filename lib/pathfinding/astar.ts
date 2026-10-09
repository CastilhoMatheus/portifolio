import {
  fromIndex,
  isWall,
  manhattan,
  neighbors,
  reconstructPath,
  toIndex,
  type Cell,
  type SearchFn,
} from "./grid";
import { MinHeap } from "./min-heap";

/**
 * Bigger than any f-score on our grids, so `f * TIE_BREAK - g` sorts by f first
 * and, among equal f, prefers the larger g (the cell that has travelled further,
 * i.e. is closer to the goal). Without it A* wanders between equally good cells.
 */
const TIE_BREAK = 10_000;

/**
 * A* search: like BFS, but always expands the cell with the lowest
 *   f = g (steps from start so far) + h (manhattan distance to goal),
 * so it heads towards the goal instead of exploring in every direction.
 *
 * Manhattan distance never overestimates the real distance on a 4-direction
 * grid ("admissible"), which is what guarantees A* still finds a shortest path.
 */
export const astar: SearchFn = (grid, start, goal) => {
  const visited: Cell[] = [];

  // A wall can never be reached: skip the search entirely
  if (isWall(grid, goal)) return { visited, path: null };

  const startIndex = toIndex(grid, start);
  const goalIndex = toIndex(grid, goal);

  /** Cells waiting to be expanded, cheapest estimated total first. */
  const open = new MinHeap<number>();
  /** Best known number of steps from start to each cell. */
  const gScore = new Map<number, number>([[startIndex, 0]]);
  const cameFrom = new Map<number, number>();
  /** Cells already expanded; their gScore is final. */
  const closed = new Set<number>();

  open.push(startIndex, manhattan(start, goal) * TIE_BREAK);

  while (!open.isEmpty()) {
    const currentIndex = open.pop()!;

    // A cell can sit in the heap several times (each time we found a better route).
    // Only the first pop is the best one; ignore the stale copies ("lazy deletion").
    if (closed.has(currentIndex)) continue;
    closed.add(currentIndex);

    const current = fromIndex(grid, currentIndex);
    visited.push(current);

    if (currentIndex === goalIndex) {
      return { visited, path: reconstructPath(grid, cameFrom, start, goal) };
    }

    const currentG = gScore.get(currentIndex)!;
    for (const next of neighbors(grid, current)) {
      const nextIndex = toIndex(grid, next);
      if (closed.has(nextIndex)) continue;

      // Every step costs 1 on this grid
      const tentativeG = currentG + 1;
      if (tentativeG >= (gScore.get(nextIndex) ?? Infinity)) continue;

      // Found a better route to `next`
      gScore.set(nextIndex, tentativeG);
      cameFrom.set(nextIndex, currentIndex);
      const f = tentativeG + manhattan(next, goal);
      open.push(nextIndex, f * TIE_BREAK - tentativeG);
    }
  }

  return { visited, path: null };
};
