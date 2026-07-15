import { apiDelete, apiGet, apiPost, buildQuery } from "./client";
import type { Pagination, UserSummary } from "@/types/api";

export function followUser(username: string) {
  return apiPost<null>(`/api/follow/${username}`);
}

export function unfollowUser(username: string) {
  return apiDelete<null>(`/api/follow/${username}`);
}

export function getMyFollowers(params?: { page?: number; limit?: number }) {
  return apiGet<{ users: UserSummary[]; pagination: Pagination }>(
    `/api/me/followers${buildQuery(params)}`
  );
}

export function getMyFollowing(params?: { page?: number; limit?: number }) {
  return apiGet<{ users: UserSummary[]; pagination: Pagination }>(
    `/api/me/following${buildQuery(params)}`
  );
}
