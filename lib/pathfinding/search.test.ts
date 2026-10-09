import { describe, expect, it } from "vitest";
import { astar } from "./astar";
import { bfs } from "./bfs";
import {
  createGrid,
  isWall,
  manhattan,
  sameCell,
  toIndex,
  type Cell,
  type Grid,
  type SearchFn,
} from "./grid";
import { parseMap } from "./test-utils";

/** Checks every rule a valid path must follow. */
function expectValidPath(grid: Grid, path: Cell[], start: Cell, goal: Cell) {
  expect(sameCell(path[0], start), "path must begin at start").toBe(true);
  expect(sameCell(path[path.length - 1], goal), "path must end at goal").toBe(
    true,
  );
  path.forEach((cell, i) => {
    expect(isWall(grid, cell), `path step ${i} is a wall`).toBe(false);
    if (i > 0) {
      expect(
        manhattan(path[i - 1], cell),
        `path step ${i} isn't adjacent to the previous one`,
      ).toBe(1);
    }
  });
}

// Every algorithm must pass these: they're what "shortest path" means.
describe.each<[string, SearchFn]>([
  ["bfs", bfs],
  ["astar", astar],
])("%s", (_name, search) => {
  it("returns just the start when start is the goal", () => {
    const grid = createGrid(3, 3);
    const cell = { row: 1, col: 1 };
    const { path } = search(grid, cell, cell);
    expect(path).toEqual([cell]);
  });

  it("finds a straight shortest path on an open grid", () => {
    const { grid, start, goal } = parseMap(`
      S....
      .....
      ....G
    `);
    const { path } = search(grid, start, goal);
    expect(path).not.toBeNull();
    expectValidPath(grid, path!, start, goal);
    expect(path!.length).toBe(manhattan(start, goal) + 1);
  });

  it("goes around walls and still finds the shortest route", () => {
    const { grid, start, goal } = parseMap(`
      S.#....
      ..#.##.
      ..#..#.
      ....#.G
    `);
    const { path } = search(grid, start, goal);
    expect(path).not.toBeNull();
    expectValidPath(grid, path!, start, goal);
    // Down to the gap in the bottom row, up through the middle, round the top right
    expect(path!.length).toBe(16);
  });

  it("returns null when the goal is walled off", () => {
    const { grid, start, goal } = parseMap(`
      S..#..
      ...#.G
      ...#..
    `);
    expect(search(grid, start, goal).path).toBeNull();
  });

  it("returns null when the goal itself is a wall", () => {
    const grid = createGrid(3, 3, [{ row: 2, col: 2 }]);
    const result = search(grid, { row: 0, col: 0 }, { row: 2, col: 2 });
    expect(result.path).toBeNull();
  });

  it("never visits walls and never visits a cell twice", () => {
    const { grid, start, goal } = parseMap(`
      S...#...
      .##.#.#.
      ....#.#.
      .####.#.
      ......#G
    `);
    const { visited } = search(grid, start, goal);
    expect(visited.length).toBeGreaterThan(0);
    expect(visited.some((cell) => isWall(grid, cell))).toBe(false);
    const unique = new Set(visited.map((cell) => toIndex(grid, cell)));
    expect(unique.size).toBe(visited.length);
  });

  it("visits the start first", () => {
    const { grid, start, goal } = parseMap(`
      ....
      .S..
      ...G
    `);
    const { visited } = search(grid, start, goal);
    expect(visited[0]).toEqual(start);
  });

  it("handles a 100×100 open grid quickly", () => {
    const grid = createGrid(100, 100);
    const t0 = performance.now();
    const { path } = search(grid, { row: 0, col: 0 }, { row: 99, col: 99 });
    expect(path?.length).toBe(199);
    expect(performance.now() - t0).toBeLessThan(200);
  });
});

describe("bfs specifics", () => {
  it("expands cells in order of distance from start (rings)", () => {
    const { grid, start, goal } = parseMap(`
      .......
      ...S...
      .......
      ......G
    `);
    const { visited } = bfs(grid, start, goal);
    const distances = visited.map((cell) => manhattan(start, cell));
    const sorted = [...distances].sort((a, b) => a - b);
    expect(distances).toEqual(sorted);
  });
});

describe("astar specifics", () => {
  it("finds paths of the same length as bfs", () => {
    const { grid, start, goal } = parseMap(`
      S...#.....
      .##.#.###.
      .#..#...#.
      .#.####.#.
      .#......#G
    `);
    expect(astar(grid, start, goal).path?.length).toBe(
      bfs(grid, start, goal).path?.length,
    );
  });

  it("visits fewer cells than bfs when heading for a far goal", () => {
    const grid = createGrid(30, 30);
    const start = { row: 15, col: 0 };
    const goal = { row: 15, col: 29 };
    expect(astar(grid, start, goal).visited.length).toBeLessThan(
      bfs(grid, start, goal).visited.length / 2,
    );
  });
});
