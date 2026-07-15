import type { InfiniteData } from "@tanstack/react-query";

interface PatchEntityConfig<TItem> {
  /** Key of the array field on flat list caches, e.g. "posts" or "users". */
  arrayKey: string;
  /** Structural guard confirming a value is actually this entity type. */
  isItem: (value: unknown) => value is TItem;
  /** Identifies the one item to patch. */
  matches: (item: TItem) => boolean;
  /** Returns the patched item. */
  patch: (item: TItem) => TItem;
}

/** Patches an entity across any cached query shape */
export function patchEntityInCache<TItem, TData = unknown>(
  data: TData,
  config: PatchEntityConfig<TItem>
): TData {
  if (!data || typeof data !== "object") return data;

  if ("pages" in data && Array.isArray((data as { pages: unknown }).pages)) {
    const infinite = data as unknown as InfiniteData<unknown>;
    return {
      ...infinite,
      pages: infinite.pages.map((page) => patchEntityInCache(page, config)),
    } as unknown as TData;
  }

  const arr = (data as Record<string, unknown>)[config.arrayKey];
  if (Array.isArray(arr)) {
    return {
      ...data,
      [config.arrayKey]: arr.map((item) =>
        config.isItem(item) && config.matches(item) ? config.patch(item) : item
      ),
    };
  }

  if (config.isItem(data) && config.matches(data)) {
    return config.patch(data) as unknown as TData;
  }

  return data;
}
