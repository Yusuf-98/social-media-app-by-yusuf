import { apiDelete, apiGet, apiPost, buildQuery } from "./client";
import type { Pagination, Post, UserSummary } from "@/types/api";

export function likePost(id: number) {
  return apiPost<null>(`/api/posts/${id}/like`);
}

export function unlikePost(id: number) {
  return apiDelete<null>(`/api/posts/${id}/like`);
}

export function getPostLikes(id: number, params?: { page?: number; limit?: number }) {
  return apiGet<{ users: UserSummary[]; pagination: Pagination }>(
    `/api/posts/${id}/likes${buildQuery(params)}`
  );
}

export function getMyLikes(params?: { page?: number; limit?: number }) {
  return apiGet<{ posts: Post[]; pagination: Pagination }>(`/api/me/likes${buildQuery(params)}`);
}
