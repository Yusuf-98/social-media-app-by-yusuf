"use client";

import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { InfiniteScrollSentinel } from "@/components/common/InfiniteScrollSentinel";
import { PostCard } from "@/components/post/PostCard";
import { FeedShell } from "@/components/post/FeedShell";
import { FeedSkeleton } from "@/components/post/PostCardSkeleton";
import { useAuth } from "@/hooks/auth/useAuth";
import { useIsClient } from "@/hooks/common/useIsClient";
import { useExplorePosts } from "@/hooks/post/useExplorePosts";
import { useFeed } from "@/hooks/post/useFeed";
import { flattenPages } from "@/lib/pagination";

const FEED_ROOT_MARGIN = "800px";

export function FeedContent() {
  const { isAuthenticated: hasToken, hasHydrated } = useAuth();
  const ready = useIsClient() && hasHydrated;
  const isAuthenticated = ready && hasToken;

  const feedQuery = useFeed(isAuthenticated);
  const exploreQuery = useExplorePosts(ready && !hasToken);
  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    isAuthenticated ? feedQuery : exploreQuery;

  const posts = flattenPages(data?.pages, (page) => page.posts);
  const awaitingAuth = !ready && posts.length === 0;

  return (
    <FeedShell>
      {(awaitingAuth || isLoading) && <FeedSkeleton />}
      {ready && isError && <ErrorState onRetry={() => refetch()} />}
      {ready && !isLoading && !isError && posts.length === 0 && (
        <EmptyState title="No posts yet" description="Follow people to see their posts here." />
      )}
      {posts.map((post, index) => (
        <div key={post.id} className="gap-xl md:gap-3xl flex w-full flex-col items-start">
          {index > 0 && <div className="h-px w-full bg-neutral-900" />}
          <PostCard post={post} priorityImage={index === 0} />
        </div>
      ))}
      {ready && !isLoading && !isError && (
        <InfiniteScrollSentinel
          onIntersect={() => fetchNextPage()}
          enabled={!!hasNextPage && !isFetchingNextPage}
          rootMargin={FEED_ROOT_MARGIN}
        />
      )}
    </FeedShell>
  );
}
