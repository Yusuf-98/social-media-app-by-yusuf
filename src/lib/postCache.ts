import { patchEntityInCache } from "@/lib/queryCache";
import type { Post } from "@/types/api";

function isPost(value: unknown): value is Post {
  return !!value && typeof value === "object" && "id" in value && "likeCount" in value;
}

export function patchPost<T>(data: T, postId: number, patch: Partial<Post>): T {
  return patchEntityInCache<Post, T>(data, {
    arrayKey: "posts",
    isItem: isPost,
    matches: (p) => p.id === postId,
    patch: (p) => ({ ...p, ...patch }),
  });
}
