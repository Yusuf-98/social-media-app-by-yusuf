"use client";

import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { InfiniteScrollSentinel } from "@/components/common/InfiniteScrollSentinel";
import { PostCard } from "@/components/post/PostCard";
import { PostCardSkeleton } from "@/components/post/PostCardSkeleton";
import { useAuth } from "@/hooks/auth/useAuth";
import { useExplorePosts } from "@/hooks/post/useExplorePosts";
import { useFeed } from "@/hooks/post/useFeed";
import { flattenPages } from "@/lib/pagination";

export default function FeedPage() {
  const { isAuthenticated, hasHydrated } = useAuth();

  const feedQuery = useFeed(hasHydrated && isAuthenticated);
  const exploreQuery = useExplorePosts(hasHydrated && !isAuthenticated);
  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    isAuthenticated ? feedQuery : exploreQuery;

  const posts = flattenPages(data?.pages, (page) => page.posts);

  return (
    <div className="custom-container mx-auto">
      <div className="gap-xl pt-xl pb-3xl md:gap-3xl mx-auto flex w-full max-w-150 flex-col md:pt-[clamp(16px,-11.43px+3.57vw,40px)]">
        {(!hasHydrated || isLoading) && (
          <div className="gap-xl md:gap-3xl flex w-full flex-col">
            <PostCardSkeleton />
            <div className="h-px w-full bg-neutral-900" />
            <PostCardSkeleton />
          </div>
        )}
        {hasHydrated && isError && <ErrorState onRetry={() => refetch()} />}
        {hasHydrated && !isLoading && !isError && posts.length === 0 && (
          <EmptyState title="No posts yet" description="Follow people to see their posts here." />
        )}
        {posts.map((post, index) => (
          <div key={post.id} className="gap-xl md:gap-3xl flex w-full flex-col items-start">
            {index > 0 && <div className="h-px w-full bg-neutral-900" />}
            <PostCard post={post} priorityImage={index === 0} />
          </div>
        ))}
        {hasHydrated && !isLoading && !isError && (
          <InfiniteScrollSentinel
            onIntersect={() => fetchNextPage()}
            enabled={!!hasNextPage && !isFetchingNextPage}
          />
        )}
      </div>
    </div>
  );
}
