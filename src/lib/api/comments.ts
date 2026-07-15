import { apiDelete, apiGet, apiPost, buildQuery } from "./client";
import type { Comment, Pagination } from "@/types/api";

export function getComments(postId: number, params?: { page?: number; limit?: number }) {
  return apiGet<{ comments: Comment[]; pagination: Pagination }>(
    `/api/posts/${postId}/comments${buildQuery(params)}`
  );
}

export function addComment(postId: number, text: string) {
  return apiPost<Comment>(`/api/posts/${postId}/comments`, { text });
}

export function deleteComment(commentId: number) {
  return apiDelete<null>(`/api/comments/${commentId}`);
}
