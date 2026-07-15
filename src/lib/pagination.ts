/** Dedup helper for infinite-query pages */
export function flattenPages<TPage, TItem extends { id: number }>(
  pages: TPage[] | undefined,
  getItems: (page: TPage) => TItem[]
): TItem[] {
  const seen = new Set<number>();
  const result: TItem[] = [];
  for (const page of pages ?? []) {
    for (const item of getItems(page)) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      result.push(item);
    }
  }
  return result;
}
