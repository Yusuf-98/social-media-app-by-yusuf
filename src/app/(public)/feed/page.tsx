import type { Metadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { FeedContent } from "@/components/post/FeedContent";
import { getExplorePosts } from "@/lib/api/posts";
import { qk } from "@/lib/queryKeys";

export const metadata: Metadata = {
  title: "Feed — Sociality",
};

export const revalidate = 60;

const PREFETCH_TIMEOUT_MS = 2500;

export default async function FeedPage() {
  const queryClient = new QueryClient();

  // Prefetch
  await Promise.race([
    queryClient.prefetchInfiniteQuery({
      queryKey: qk.explorePosts(),
      queryFn: ({ pageParam }: { pageParam: number }) =>
        getExplorePosts({ page: pageParam, limit: 10 }),
      initialPageParam: 1,
    }),
    new Promise((resolve) => setTimeout(resolve, PREFETCH_TIMEOUT_MS)),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FeedContent />
    </HydrationBoundary>
  );
}
