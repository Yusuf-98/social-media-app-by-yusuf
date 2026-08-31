"use client";

import { EmptyGallery } from "@/components/profile/EmptyGallery";
import { ErrorState } from "@/components/common/ErrorState";
import { InfiniteScrollSentinel } from "@/components/common/InfiniteScrollSentinel";
import { PostGrid } from "@/components/post/PostGrid";
import { PostGridSkeleton } from "@/components/post/PostGridSkeleton";
import { useMyPosts } from "@/hooks/user/useMe";
import { flattenPages } from "@/lib/pagination";

export function MyPostsGrid() {
  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMyPosts();
  const posts = flattenPages(data?.pages, (page) => page.posts);
  if (isLoading) return <PostGridSkeleton />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (posts.length === 0) return <EmptyGallery />;
  return (
    <div className="gap-xl flex w-full flex-col items-start">
      <PostGrid posts={posts} />
      <InfiniteScrollSentinel
        onIntersect={() => fetchNextPage()}
        enabled={!!hasNextPage && !isFetchingNextPage}
      />
    </div>
  );
}
