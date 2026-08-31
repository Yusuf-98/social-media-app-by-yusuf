import type { Query, QueryClient } from "@tanstack/react-query";

/** Query key factory */
export const qk = {
  feed: () => ["feed"] as const,
  explorePosts: () => ["posts", "explore"] as const,
  post: (id: number) => ["post", id] as const,
  postLikers: (postId: number) => ["post", postId, "likes"] as const,
  comments: (postId: number) => ["comments", postId] as const,
  me: {
    self: () => ["me"] as const,
    posts: () => ["me", "posts"] as const,
    saved: () => ["me", "saved"] as const,
    likes: () => ["me", "likes"] as const,
    likedIds: () => ["me", "likedPostIds"] as const,
    savedIds: () => ["me", "savedPostIds"] as const,
    followers: () => ["me", "followers"] as const,
    following: () => ["me", "following"] as const,
  },
  users: {
    profile: (username: string) => ["users", username] as const,
    posts: (username: string) => ["users", username, "posts"] as const,
    likes: (username: string) => ["users", username, "likes"] as const,
    followers: (username: string) => ["users", username, "followers"] as const,
    following: (username: string) => ["users", username, "following"] as const,
    search: (query: string) => ["users", "search", query] as const,
  },
};

const POST_USER_QUERY_ROOTS = new Set(["feed", "posts", "me", "users", "post"]);

/** Post/user query scope */
export function isPostOrUserQuery({ queryKey }: Query): boolean {
  return POST_USER_QUERY_ROOTS.has(queryKey[0] as string);
}

/** Resync a single post after a mutation error */
export function invalidatePost(queryClient: QueryClient, postId: number) {
  queryClient.invalidateQueries({ queryKey: qk.post(postId) });
}

/** Resync a user's profile (and my own stats) after a follow mutation settles */
export function invalidateUserProfile(queryClient: QueryClient, username: string) {
  queryClient.invalidateQueries({ queryKey: qk.users.profile(username) });
  queryClient.invalidateQueries({ queryKey: qk.me.self() });
}

/** One-time reconciliation after liked/saved ids finish hydrating at startup */
export function invalidateAllPostQueries(queryClient: QueryClient) {
  queryClient.invalidateQueries({ predicate: isPostOrUserQuery });
}
