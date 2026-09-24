import type { Metadata } from "next";
import { cookies } from "next/headers";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { FeedContent } from "@/components/post/FeedContent";
import { getExplorePosts } from "@/lib/api/posts";
import { TOKEN_KEY } from "@/lib/auth-constants";
import { qk } from "@/lib/queryKeys";

export const metadata: Metadata = {
  title: "Feed — Sociality",
};

const PREFETCH_TIMEOUT_MS = 2500;

export default async function FeedPage() {
  const hasToken = (await cookies()).has(TOKEN_KEY);
  const queryClient = new QueryClient();

  // Prefetch
  if (!hasToken) {
    await Promise.race([
      queryClient.prefetchInfiniteQuery({
        queryKey: qk.explorePosts(),
        queryFn: ({ pageParam }: { pageParam: number }) =>
          getExplorePosts({ page: pageParam, limit: 10 }),
        initialPageParam: 1,
      }),
      new Promise((resolve) => setTimeout(resolve, PREFETCH_TIMEOUT_MS)),
    ]);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FeedContent />
    </HydrationBoundary>
  );
}
