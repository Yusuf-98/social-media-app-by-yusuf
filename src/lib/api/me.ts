import { apiGet, apiPatch, buildQuery } from "./client";
import type { MyProfile, Pagination, Post } from "@/types/api";

interface RawMeResponse {
  profile: {
    id: number;
    name: string;
    username: string;
    email: string;
    phone: string | null;
    bio: string | null;
    avatarUrl: string | null;
  };
  stats: {
    posts: number;
    followers: number;
    following: number;
    likes: number;
  };
}

function normalizeMe(raw: RawMeResponse): MyProfile {
  return {
    ...raw.profile,
    counts: {
      post: raw.stats.posts,
      followers: raw.stats.followers,
      following: raw.stats.following,
      likes: raw.stats.likes,
    },
  };
}

export async function getMe() {
  const raw = await apiGet<RawMeResponse>("/api/me");
  return normalizeMe(raw);
}

interface RawUpdateMeResponse {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string | null;
  bio: string | null;
  avatarUrl: string | null;
  updatedAt: string;
}

export async function updateMe(payload: FormData | Record<string, unknown>) {
  return apiPatch<RawUpdateMeResponse>("/api/me", payload);
}

export async function getMyPosts(params?: { page?: number; limit?: number }) {
  const data = await apiGet<{ items: Post[]; pagination: Pagination }>(
    `/api/me/posts${buildQuery(params)}`
  );
  return { posts: data.items, pagination: data.pagination };
}
