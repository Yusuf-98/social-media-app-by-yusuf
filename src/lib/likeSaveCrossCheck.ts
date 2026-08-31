import type { QueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import type { Post } from "@/types/api";

function crossCheck(
  post: Post,
  likedIds: number[] | undefined,
  savedIds: number[] | undefined
): Post {
  return {
    ...post,
    likedByMe: likedIds?.includes(post.id) ? true : post.likedByMe,
    savedByMe: savedIds?.includes(post.id) ? true : post.savedByMe,
  };
}

export function applyLikeSaveCrossCheck(queryClient: QueryClient, post: Post): Post {
  const likedIds = queryClient.getQueryData<number[]>(qk.me.likedIds());
  const savedIds = queryClient.getQueryData<number[]>(qk.me.savedIds());
  return crossCheck(post, likedIds, savedIds);
}

export function applyLikeSaveCrossCheckList(queryClient: QueryClient, posts: Post[]): Post[] {
  const likedIds = queryClient.getQueryData<number[]>(qk.me.likedIds());
  const savedIds = queryClient.getQueryData<number[]>(qk.me.savedIds());
  return posts.map((p) => crossCheck(p, likedIds, savedIds));
}
