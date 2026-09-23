import type { Pagination, Post } from "@/types/api";

type PostListFetcher = (params: {
  page: number;
  limit: number;
}) => Promise<{ posts: Post[]; pagination: Pagination }>;

export async function fetchAllPostIds(fetcher: PostListFetcher): Promise<number[]> {
  const ids: number[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const { posts, pagination } = await fetcher({ page, limit: 50 });
    ids.push(...posts.map((p) => p.id));
    totalPages = pagination.totalPages;
    page += 1;
  } while (page <= totalPages);

  return ids;
}
