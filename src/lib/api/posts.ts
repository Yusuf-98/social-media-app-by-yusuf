import { apiDelete, apiGet, apiPost, buildQuery } from "./client";
import type { Pagination, Post } from "@/types/api";

export function getExplorePosts(params?: { page?: number; limit?: number }) {
  return apiGet<{ posts: Post[]; pagination: Pagination }>(`/api/posts${buildQuery(params)}`);
}

export function getPost(id: number) {
  return apiGet<Post>(`/api/posts/${id}`);
}

export function createPost(formData: FormData) {
  return apiPost<Post>("/api/posts", formData);
}

export function deletePost(id: number) {
  return apiDelete<null>(`/api/posts/${id}`);
}
