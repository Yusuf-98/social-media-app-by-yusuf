import type { Query, QueryClient } from "@tanstack/react-query";

const POST_USER_QUERY_ROOTS = new Set(["feed", "posts", "me", "users", "post"]);

/** Post/user query scope */
export function isPostOrUserQuery({ queryKey }: Query): boolean {
  return POST_USER_QUERY_ROOTS.has(queryKey[0] as string);
}

/** Post/user query invalidation registry */
export function invalidatePostQueries(queryClient: QueryClient, postId?: number) {
  queryClient.invalidateQueries({ queryKey: ["feed"] });
  queryClient.invalidateQueries({ queryKey: ["posts"] });
  queryClient.invalidateQueries({ queryKey: ["me"] });
  queryClient.invalidateQueries({ queryKey: ["users"] });
  if (postId !== undefined) {
    queryClient.invalidateQueries({ queryKey: ["post", postId] });
    queryClient.invalidateQueries({ queryKey: ["comments", postId] });
  }
}

export function invalidateUserQueries(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: ["me"] });
  queryClient.invalidateQueries({ queryKey: ["users"] });
}
