import { describe, expect, it } from "vitest";
import { flattenPages } from "@/lib/pagination";

interface Item {
  id: number;
  value: string;
}

describe("flattenPages", () => {
  it("flattens items across pages", () => {
    const pages = [{ items: [{ id: 1, value: "a" }] }, { items: [{ id: 2, value: "b" }] }];
    const result = flattenPages<{ items: Item[] }, Item>(pages, (p) => p.items);
    expect(result.map((i) => i.id)).toEqual([1, 2]);
  });

  it("dedupes items that appear on more than one page by id", () => {
    const pages = [
      { items: [{ id: 1, value: "a" }, { id: 2, value: "b" }] },
      { items: [{ id: 2, value: "stale" }, { id: 3, value: "c" }] },
    ];
    const result = flattenPages<{ items: Item[] }, Item>(pages, (p) => p.items);
    expect(result.map((i) => i.id)).toEqual([1, 2, 3]);
    expect(result.find((i) => i.id === 2)?.value).toBe("b");
  });

  it("returns an empty array for undefined pages", () => {
    expect(flattenPages<{ items: Item[] }, Item>(undefined, (p) => p.items)).toEqual([]);
  });
});
