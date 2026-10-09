"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { astar } from "@/lib/pathfinding/astar";
import { bfs } from "@/lib/pathfinding/bfs";
import {
  createGrid,
  inBounds,
  isWall,
  sameCell,
  toIndex,
  type Cell,
  type Grid,
  type SearchFn,
  type SearchResult,
} from "@/lib/pathfinding/grid";

const ALGORITHMS = {
  astar: { label: "A*", file: "astar.ts", search: astar },
  bfs: { label: "BFS", file: "bfs.ts", search: bfs },
} satisfies Record<string, { label: string; file: string; search: SearchFn }>;

type AlgorithmKey = keyof typeof ALGORITHMS;
type Mode = "goal" | "walls";

type Stats = {
  algorithm: AlgorithmKey;
  visited: number;
  ms: number;
  pathLength: number | null;
  implemented: boolean;
};

type Colors = Record<
  "bg" | "muted" | "primary" | "blue" | "gold" | "orange",
  string
>;

// Animation timing
const MIN_VISIT_MS = 300;
const MAX_VISIT_MS = 1400;
const PATH_MS = 450;
/** How many of the most recent visited cells glow brighter (the "wavefront"). */
const WAVEFRONT = 40;

function readColors(): Colors {
  const style = getComputedStyle(document.documentElement);
  const get = (name: string) => style.getPropertyValue(name).trim();
  return {
    bg: get("--bg"),
    muted: get("--muted"),
    primary: get("--primary"),
    blue: get("--blue"),
    gold: get("--gold"),
    orange: get("--orange"),
  };
}

/**
 * Draw the name on a tiny hidden canvas, one pixel per cell,
 * and turn every solid pixel into a wall.
 */
function nameToWalls(rows: number, cols: number): Grid {
  const grid = createGrid(rows, cols);
  const canvas = document.createElement("canvas");
  canvas.width = cols;
  canvas.height = rows;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return grid;

  const family = getComputedStyle(document.body).fontFamily;
  const fit = (text: string) => {
    let size = Math.floor(rows * 0.62);
    ctx.font = `800 ${size}px ${family}`;
    const width = ctx.measureText(text).width;
    if (width > cols * 0.82) size = Math.floor((size * cols * 0.82) / width);
    return size;
  };

  let text = site.shortName.toUpperCase();
  let size = fit(text);
  // Too narrow for the full name (phones): use initials
  if (size < 8) {
    text = `${site.shortName[0]}${site.lastName[0]}`.toUpperCase();
    size = fit(text);
  }

  ctx.font = `800 ${size}px ${family}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#000";
  ctx.fillText(text, cols / 2, rows / 2 + size * 0.05);

  const { data } = ctx.getImageData(0, 0, cols, rows);
  for (let i = 0; i < rows * cols; i++) {
    if (data[i * 4 + 3] > 110) grid.walls[i] = 1;
  }
  return grid;
}

type World = {
  grid: Grid | null;
  start: Cell;
  goal: Cell;
  cellSize: number;
  result: SearchResult | null;
  /** 0 = not animating: show the whole result. */
  animStart: number;
  colors: Colors | null;
  algorithm: AlgorithmKey;
  /** While dragging in wall mode: the value being painted. */
  painting: 0 | 1 | null;
  /** Last painted cell, to fill gaps when the pointer moves fast. */
  lastPainted: Cell | null;
  frame: number;
};

/** Draws one frame. Returns true while the animation still has more to show. */
function drawFrame(w: World, canvas: HTMLCanvasElement): boolean {
  const ctx = canvas.getContext("2d");
  if (!ctx || !w.grid) return false;
  const colors = (w.colors ??= readColors());
  const { grid, cellSize: s, result } = w;

  // How far along the animation is
  const visited = result?.visited ?? [];
  const path = result?.path ?? [];
  const visitMs = Math.min(
    MAX_VISIT_MS,
    Math.max(MIN_VISIT_MS, visited.length * 3),
  );
  const elapsed = w.animStart ? performance.now() - w.animStart : Infinity;
  const shownVisited = Math.min(
    visited.length,
    Math.floor((elapsed / visitMs) * visited.length),
  );
  const shownPath = Math.min(
    path.length,
    Math.floor(((elapsed - visitMs) / PATH_MS) * path.length),
  );

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Empty cells: faint dots, so it reads as a grid
  ctx.fillStyle = colors.muted;
  ctx.globalAlpha = 0.28;
  for (let r = 0; r < grid.rows; r++) {
    for (let c = 0; c < grid.cols; c++) {
      if (grid.walls[r * grid.cols + c]) continue;
      ctx.beginPath();
      ctx.arc(c * s + s / 2, r * s + s / 2, s * 0.07, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Visited cells, with the most recent ones glowing (the search frontier)
  ctx.fillStyle = colors.blue;
  for (let i = 0; i < shownVisited; i++) {
    const age = (shownVisited - i) / WAVEFRONT;
    ctx.globalAlpha = age < 1 ? 0.75 - age * 0.5 : 0.22;
    const { row, col } = visited[i];
    ctx.beginPath();
    ctx.roundRect(col * s + 1, row * s + 1, s - 2, s - 2, s * 0.2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Walls: your name, in Palmeiras green
  ctx.fillStyle = colors.primary;
  for (let i = 0; i < grid.walls.length; i++) {
    if (!grid.walls[i]) continue;
    const row = Math.floor(i / grid.cols);
    const col = i % grid.cols;
    ctx.beginPath();
    ctx.roundRect(col * s + 1, row * s + 1, s - 2, s - 2, s * 0.22);
    ctx.fill();
  }

  // The path, in Brazil gold
  ctx.fillStyle = colors.gold;
  for (let i = 0; i < shownPath; i++) {
    const { row, col } = path[i];
    ctx.beginPath();
    ctx.roundRect(col * s + 2, row * s + 2, s - 4, s - 4, s * 0.3);
    ctx.fill();
  }

  // Start (green ring) and goal (Irish orange)
  const center = (cell: Cell) => [cell.col * s + s / 2, cell.row * s + s / 2];
  const [sx, sy] = center(w.start);
  ctx.strokeStyle = colors.primary;
  ctx.lineWidth = Math.max(2, s * 0.16);
  ctx.beginPath();
  ctx.arc(sx, sy, s * 0.34, 0, Math.PI * 2);
  ctx.stroke();

  const [gx, gy] = center(w.goal);
  ctx.fillStyle = colors.orange;
  ctx.beginPath();
  ctx.arc(gx, gy, s * 0.38, 0, Math.PI * 2);
  ctx.fill();

  // Keep animating until the whole path is drawn
  return shownPath < path.length || shownVisited < visited.length;
}

export default function Pathfinder() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [algorithm, setAlgorithm] = useState<AlgorithmKey>("astar");
  const [mode, setMode] = useState<Mode>("goal");
  const [stats, setStats] = useState<Stats | null>(null);

  // Everything the render loop needs lives in refs, so it never re-renders React
  const world = useRef<World>({
    grid: null,
    start: { row: 0, col: 0 },
    goal: { row: 0, col: 0 },
    cellSize: 16,
    result: null,
    animStart: 0,
    colors: null,
    algorithm: "astar",
    painting: null,
    lastPainted: null,
    frame: 0,
  });

  const draw = useCallback(() => {
    const w = world.current;
    cancelAnimationFrame(w.frame);
    const loop = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      if (drawFrame(w, canvas)) w.frame = requestAnimationFrame(loop);
      else w.animStart = 0;
    };
    loop();
  }, []);

  const run = useCallback(
    (animate: boolean) => {
      const w = world.current;
      if (!w.grid) return;
      const { search } = ALGORITHMS[w.algorithm];

      const t0 = performance.now();
      const result = search(w.grid, w.start, w.goal);
      const ms = performance.now() - t0;

      w.result = result;
      setStats({
        algorithm: w.algorithm,
        visited: result.visited.length,
        ms,
        pathLength: result.path ? result.path.length - 1 : null,
        // The starting stubs return nothing at all
        implemented: result.visited.length > 0 || result.path !== null,
      });

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      w.animStart = animate && !reduceMotion ? performance.now() : 0;
      draw();
    },
    [draw],
  );

  // Build the grid to fit the container, and rebuild when its size changes
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const w = world.current;
    let lastSize = "";

    let cancelled = false;

    const build = () => {
      const width = container.clientWidth;
      const cellSize = width < 640 ? 14 : 16;
      const cols = Math.floor(width / cellSize);
      // Next keeps visited pages mounted but hidden (display: none) for instant
      // back navigation, so the width can drop to 0. Keep the current grid.
      if (cols < 8) return;
      const rows = Math.min(30, Math.max(14, Math.round(cols * 0.36)));
      if (`${rows}x${cols}` === lastSize) return;
      lastSize = `${rows}x${cols}`;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = cols * cellSize * dpr;
      canvas.height = rows * cellSize * dpr;
      canvas.style.width = `${cols * cellSize}px`;
      canvas.style.height = `${rows * cellSize}px`;
      canvas.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);

      w.cellSize = cellSize;
      w.grid = nameToWalls(rows, cols);
      w.start = { row: Math.floor(rows / 2), col: 1 };
      w.goal = { row: Math.floor(rows / 2), col: cols - 2 };
      run(true);
    };

    let observer: ResizeObserver | undefined;
    // Wait for Gabarito, or the walls would be drawn in a fallback font
    document.fonts.ready.then(() => {
      // The component may have unmounted while the font was loading
      if (cancelled) return;
      build();
      observer = new ResizeObserver(build);
      observer.observe(container);
    });

    // Redraw in the new palette when the theme toggles
    const themeObserver = new MutationObserver(() => {
      w.colors = null;
      draw();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      cancelled = true;
      observer?.disconnect();
      themeObserver.disconnect();
      cancelAnimationFrame(w.frame);
    };
  }, [draw, run]);

  const chooseAlgorithm = (key: AlgorithmKey) => {
    setAlgorithm(key);
    world.current.algorithm = key;
    run(true);
  };

  const cellAt = (event: React.PointerEvent): Cell | null => {
    const rect = event.currentTarget.getBoundingClientRect();
    const s = world.current.cellSize;
    const cell = {
      row: Math.floor((event.clientY - rect.top) / s),
      col: Math.floor((event.clientX - rect.left) / s),
    };
    return world.current.grid && inBounds(world.current.grid, cell)
      ? cell
      : null;
  };

  const moveGoal = (cell: Cell, animate: boolean) => {
    const w = world.current;
    if (!w.grid || isWall(w.grid, cell) || sameCell(cell, w.start)) return;
    if (sameCell(cell, w.goal) && !animate) return;
    w.goal = cell;
    run(animate);
  };

  const paint = (cell: Cell) => {
    const w = world.current;
    if (!w.grid || w.painting === null) return;
    const grid = w.grid;
    // Fast drags skip cells between pointer events, so paint the whole line from
    // the last painted cell (stepping along the longer axis)
    const from = w.lastPainted ?? cell;
    const steps = Math.max(
      Math.abs(cell.row - from.row),
      Math.abs(cell.col - from.col),
    );
    let changed = false;
    for (let i = 0; i <= steps; i++) {
      const t = steps === 0 ? 0 : i / steps;
      const step = {
        row: Math.round(from.row + (cell.row - from.row) * t),
        col: Math.round(from.col + (cell.col - from.col) * t),
      };
      if (sameCell(step, w.start) || sameCell(step, w.goal)) continue;
      const index = toIndex(grid, step);
      if (grid.walls[index] === w.painting) continue;
      grid.walls[index] = w.painting;
      changed = true;
    }
    w.lastPainted = cell;
    if (changed) run(false);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const cell = cellAt(event);
    if (!cell) return;
    const w = world.current;
    if (mode === "walls" && w.grid) {
      event.currentTarget.setPointerCapture(event.pointerId);
      w.painting = isWall(w.grid, cell) ? 0 : 1;
      w.lastPainted = null;
      paint(cell);
    } else {
      moveGoal(cell, true);
    }
  };

  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const cell = cellAt(event);
    if (!cell) return;
    if (mode === "walls") {
      if (event.buttons === 1) paint(cell);
    } else if (event.pointerType === "mouse" && event.buttons === 0) {
      // Hover: instant result, no animation
      moveGoal(cell, false);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const moves: Record<string, Cell> = {
      ArrowUp: { row: -1, col: 0 },
      ArrowDown: { row: 1, col: 0 },
      ArrowLeft: { row: 0, col: -1 },
      ArrowRight: { row: 0, col: 1 },
    };
    const w = world.current;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      run(true);
      return;
    }
    const d = moves[event.key];
    if (!d || !w.grid) return;
    event.preventDefault();
    const next = { row: w.goal.row + d.row, col: w.goal.col + d.col };
    if (inBounds(w.grid, next)) moveGoal(next, false);
  };

  const reset = () => {
    const w = world.current;
    if (!w.grid) return;
    w.grid = nameToWalls(w.grid.rows, w.grid.cols);
    w.goal = { row: Math.floor(w.grid.rows / 2), col: w.grid.cols - 2 };
    run(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <SegmentedControl
          label="Algorithm"
          value={algorithm}
          options={Object.entries(ALGORITHMS).map(([key, a]) => ({
            value: key as AlgorithmKey,
            label: a.label,
          }))}
          onChange={chooseAlgorithm}
        />
        <SegmentedControl
          label="Mode"
          value={mode}
          options={[
            { value: "goal", label: "Move goal" },
            { value: "walls", label: "Draw walls" },
          ]}
          onChange={setMode}
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => run(true)}
            className={buttonClass}
          >
            Replay
          </button>
          <button type="button" onClick={reset} className={buttonClass}>
            Reset
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="bg-surface w-full overflow-hidden rounded-2xl p-2 sm:p-3"
      >
        <canvas
          ref={canvasRef}
          tabIndex={0}
          role="img"
          aria-label={`Pathfinding grid. Your name is drawn as walls. ${
            stats?.pathLength != null
              ? `Shortest path: ${stats.pathLength} steps.`
              : ""
          } Use arrow keys to move the goal, Enter to replay.`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={() => {
            world.current.painting = null;
            world.current.lastPainted = null;
          }}
          onKeyDown={onKeyDown}
          className="focus-visible:outline-primary mx-auto block cursor-crosshair rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4"
          style={{ touchAction: mode === "walls" ? "none" : "manipulation" }}
        />
      </div>

      <p className="text-muted min-h-6 font-mono text-sm" aria-live="polite">
        {stats &&
          (stats.implemented ? (
            <>
              <span className="text-text font-semibold">
                {ALGORITHMS[stats.algorithm].label}
              </span>
              {" · "}
              {stats.visited.toLocaleString()} cells visited
              {" · "}
              {stats.ms < 1 ? stats.ms.toFixed(2) : stats.ms.toFixed(1)} ms
              {" · "}
              {stats.pathLength === null
                ? "no path"
                : `path ${stats.pathLength} steps`}
            </>
          ) : (
            <>
              {ALGORITHMS[stats.algorithm].label} isn&apos;t implemented yet:
              see lib/pathfinding/{ALGORITHMS[stats.algorithm].file}
            </>
          ))}
      </p>

      <Legend />
    </div>
  );
}

const buttonClass =
  "bg-surface hover:text-primary focus-visible:outline-primary rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2";

function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="bg-surface flex rounded-full p-1"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          onClick={() => onChange(option.value)}
          className={`focus-visible:outline-primary rounded-full px-3 py-1 text-sm font-medium transition-colors focus-visible:outline-2 ${
            value === option.value
              ? "bg-primary text-bg"
              : "text-muted hover:text-text"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function Legend() {
  const items = [
    { label: "Walls (my name)", swatch: "bg-primary rounded-[3px]" },
    { label: "Visited", swatch: "bg-blue/40 rounded-[3px]" },
    { label: "Shortest path", swatch: "bg-gold rounded-[3px]" },
    { label: "Start", swatch: "border-primary rounded-full border-2" },
    { label: "Goal", swatch: "bg-orange rounded-full" },
  ];
  return (
    <ul className="text-muted flex flex-wrap gap-x-5 gap-y-2 text-xs">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-2">
          <span aria-hidden="true" className={`size-3 ${item.swatch}`} />
          {item.label}
        </li>
      ))}
    </ul>
  );
}
