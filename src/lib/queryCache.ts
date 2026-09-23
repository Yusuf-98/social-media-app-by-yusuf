import type { InfiniteData } from "@tanstack/react-query";

interface PatchEntityConfig<TItem> {
  arrayKey: string;
  isItem: (value: unknown) => value is TItem;
  matches: (item: TItem) => boolean;
  patch: (item: TItem) => TItem;
}

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
