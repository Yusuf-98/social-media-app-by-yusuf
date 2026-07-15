import { apiDelete, apiGet, apiPost, buildQuery } from "./client";
import type { Pagination, Post } from "@/types/api";

export function savePost(id: number) {
  return apiPost<null>(`/api/posts/${id}/save`);
}

export function unsavePost(id: number) {
  return apiDelete<null>(`/api/posts/${id}/save`);
}

export function getMySaved(params?: { page?: number; limit?: number }) {
  return apiGet<{ posts: Post[]; pagination: Pagination }>(`/api/me/saved${buildQuery(params)}`);
}
