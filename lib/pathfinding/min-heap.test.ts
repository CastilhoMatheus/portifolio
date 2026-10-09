import { describe, expect, it } from "vitest";
import { MinHeap } from "./min-heap";

describe("MinHeap", () => {
  it("starts empty", () => {
    const heap = new MinHeap<string>();
    expect(heap.size).toBe(0);
    expect(heap.isEmpty()).toBe(true);
    expect(heap.pop()).toBeUndefined();
    expect(heap.peek()).toBeUndefined();
  });

  it("pops the lowest priority first", () => {
    const heap = new MinHeap<string>();
    heap.push("c", 3);
    heap.push("a", 1);
    heap.push("b", 2);
    expect(heap.peek()).toBe("a");
    expect(heap.size).toBe(3);
    expect([heap.pop(), heap.pop(), heap.pop()]).toEqual(["a", "b", "c"]);
    expect(heap.isEmpty()).toBe(true);
  });

  it("keeps working when pushes and pops are mixed", () => {
    const heap = new MinHeap<number>();
    heap.push(5, 5);
    heap.push(1, 1);
    expect(heap.pop()).toBe(1);
    heap.push(3, 3);
    heap.push(0, 0);
    expect(heap.pop()).toBe(0);
    expect(heap.pop()).toBe(3);
    expect(heap.pop()).toBe(5);
  });

  it("sorts 1,000 random numbers (heap sort)", () => {
    const numbers = Array.from({ length: 1000 }, () => Math.random() * 1000);
    const heap = new MinHeap<number>();
    for (const n of numbers) heap.push(n, n);
    const out: number[] = [];
    while (!heap.isEmpty()) out.push(heap.pop()!);
    expect(out).toEqual([...numbers].sort((a, b) => a - b));
  });

  it("allows equal priorities", () => {
    const heap = new MinHeap<string>();
    heap.push("x", 1);
    heap.push("y", 1);
    expect(new Set([heap.pop(), heap.pop()])).toEqual(new Set(["x", "y"]));
  });
});
