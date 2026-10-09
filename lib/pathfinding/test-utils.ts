import { createGrid, type Cell, type Grid } from "./grid";

/**
 * Build a grid from an ASCII map, for readable tests:
 *   S = start, G = goal, # = wall, . = open
 */
export function parseMap(map: string): { grid: Grid; start: Cell; goal: Cell } {
  const lines = map
    .trim()
    .split("\n")
    .map((line) => line.trim());

  const walls: Cell[] = [];
  let start: Cell | undefined;
  let goal: Cell | undefined;

  lines.forEach((line, row) => {
    [...line].forEach((char, col) => {
      if (char === "#") walls.push({ row, col });
      if (char === "S") start = { row, col };
      if (char === "G") goal = { row, col };
    });
  });

  if (!start || !goal) throw new Error("Map needs an S and a G");
  return {
    grid: createGrid(lines.length, lines[0].length, walls),
    start,
    goal,
  };
}
