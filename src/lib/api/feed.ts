import { apiGet, buildQuery } from "./client";
import type { Pagination, Post } from "@/types/api";

export async function getFeed(params?: { page?: number; limit?: number }) {
  const data = await apiGet<{ items: Post[]; pagination: Pagination }>(
    `/api/feed${buildQuery(params)}`
  );
  return { posts: data.items, pagination: data.pagination };
}
