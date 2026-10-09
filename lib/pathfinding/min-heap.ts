/**
 * A binary min-heap: a priority queue where pop() always returns the item with
 * the LOWEST priority, in O(log n). A* uses it as its "open set".
 *
 * The heap is a complete binary tree stored in a flat array:
 *   - the children of index i live at 2i + 1 and 2i + 2
 *   - the parent of index i lives at (i - 1) >> 1   (>> 1 is "divide by 2, round down")
 * The one rule ("heap property"): every parent's priority <= its children's.
 * So the smallest item is always at index 0.
 */
export class MinHeap<T> {
  private entries: { item: T; priority: number }[] = [];

  get size(): number {
    return this.entries.length;
  }

  isEmpty(): boolean {
    return this.entries.length === 0;
  }

  /** The item with the lowest priority, without removing it. */
  peek(): T | undefined {
    return this.entries[0]?.item;
  }

  /** Add at the end of the array, then "bubble up" until the parent is smaller. O(log n). */
  push(item: T, priority: number): void {
    this.entries.push({ item, priority });
    this.bubbleUp(this.entries.length - 1);
  }

  /**
   * Removes and returns the item with the lowest priority, or undefined if empty.
   * Take the root, move the LAST entry into its place, then "sink it down"
   * until both children are bigger. O(log n).
   */
  pop(): T | undefined {
    const entries = this.entries;
    if (entries.length === 0) return undefined;

    const top = entries[0];
    const last = entries.pop()!;
    if (entries.length > 0) {
      entries[0] = last;
      this.sinkDown(0);
    }
    return top.item;
  }

  private bubbleUp(index: number): void {
    const entries = this.entries;
    while (index > 0) {
      const parent = (index - 1) >> 1;
      if (entries[parent].priority <= entries[index].priority) return;
      this.swap(index, parent);
      index = parent;
    }
  }

  private sinkDown(index: number): void {
    const entries = this.entries;
    const length = entries.length;

    while (true) {
      const left = 2 * index + 1;
      const right = left + 1;
      let smallest = index;

      if (
        left < length &&
        entries[left].priority < entries[smallest].priority
      ) {
        smallest = left;
      }
      if (
        right < length &&
        entries[right].priority < entries[smallest].priority
      ) {
        smallest = right;
      }
      // Both children are bigger (or don't exist): the heap property holds again
      if (smallest === index) return;

      this.swap(index, smallest);
      index = smallest;
    }
  }

  private swap(a: number, b: number): void {
    [this.entries[a], this.entries[b]] = [this.entries[b], this.entries[a]];
  }
}
