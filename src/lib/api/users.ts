import { apiGet, buildQuery } from "./client";
import type { Pagination, Post, PublicProfile, UserSummary } from "@/types/api";

export function searchUsers(q: string, params?: { page?: number; limit?: number }) {
  return apiGet<{ users: UserSummary[]; pagination: Pagination }>(
    `/api/users/search${buildQuery({ q, ...params })}`
  );
}

export function getPublicProfile(username: string) {
  return apiGet<PublicProfile>(`/api/users/${username}`);
}

export function getUserPosts(username: string, params?: { page?: number; limit?: number }) {
  return apiGet<{ posts: Post[]; pagination: Pagination }>(
    `/api/users/${username}/posts${buildQuery(params)}`
  );
}

export function getUserLikes(username: string, params?: { page?: number; limit?: number }) {
  return apiGet<{ posts: Post[]; pagination: Pagination }>(
    `/api/users/${username}/likes${buildQuery(params)}`
  );
}

export function getUserFollowers(username: string, params?: { page?: number; limit?: number }) {
  return apiGet<{ users: UserSummary[]; pagination: Pagination }>(
    `/api/users/${username}/followers${buildQuery(params)}`
  );
}

export function getUserFollowing(username: string, params?: { page?: number; limit?: number }) {
  return apiGet<{ users: UserSummary[]; pagination: Pagination }>(
    `/api/users/${username}/following${buildQuery(params)}`
  );
}
