import { describe, expect, it } from "vitest";
import { patchEntityInCache } from "@/lib/queryCache";

interface Item {
  id: number;
  count: number;
}

const isItem = (value: unknown): value is Item =>
  !!value && typeof value === "object" && "id" in value;

const config = {
  arrayKey: "items",
  isItem,
  matches: (item: Item) => item.id === 1,
  patch: (item: Item) => ({ ...item, count: item.count + 1 }),
};

describe("patchEntityInCache", () => {
  it("patches a single flat entity", () => {
    const result = patchEntityInCache<Item, Item>({ id: 1, count: 0 }, config);
    expect(result.count).toBe(1);
  });

  it("leaves a non-matching flat entity untouched", () => {
    const result = patchEntityInCache<Item, Item>({ id: 2, count: 0 }, config);
    expect(result.count).toBe(0);
  });

  it("patches the matching item inside a list-wrapped shape", () => {
    const data = { items: [{ id: 1, count: 0 }, { id: 2, count: 0 }] };
    const result = patchEntityInCache<Item, typeof data>(data, config);
    expect(result.items[0].count).toBe(1);
    expect(result.items[1].count).toBe(0);
  });

  it("patches the matching item across InfiniteData pages", () => {
    const data = {
      pages: [{ items: [{ id: 1, count: 0 }] }, { items: [{ id: 1, count: 5 }] }],
      pageParams: [1, 2],
    };
    const result = patchEntityInCache<Item, typeof data>(data, config);
    expect(result.pages[0].items[0].count).toBe(1);
    expect(result.pages[1].items[0].count).toBe(6);
  });

  it("returns non-object data unchanged", () => {
    expect(patchEntityInCache<Item, undefined>(undefined, config)).toBeUndefined();
  });
});
