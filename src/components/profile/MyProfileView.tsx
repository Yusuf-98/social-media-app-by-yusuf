"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Settings } from "lucide-react";
import { ArrowIcon, GridIcon, ShareIcon } from "@/components/icons";
import { BookmarkIcon } from "@/components/icons/BookmarkIcon";
import { HeartOutlineIcon } from "@/components/icons";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { InfiniteScrollSentinel } from "@/components/common/InfiniteScrollSentinel";
import { PostGrid } from "@/components/post/PostGrid";
import { PostGridSkeleton } from "@/components/post/PostGridSkeleton";
import { ShareDialog } from "@/components/post/ShareDialog";
import { EmptyGallery } from "@/components/profile/EmptyGallery";
import { ProfileHeaderSkeleton } from "@/components/profile/ProfileHeaderSkeleton";
import { SettingsPanel } from "@/components/profile/SettingsPanel";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user/UserAvatar";
import { useMe, useMyLikes, useMyPosts, useMySaved } from "@/hooks/user/useMe";
import { flattenPages } from "@/lib/pagination";
import { cn } from "@/lib/utils";

type Tab = "gallery" | "saved" | "likes" | "settings";

export function MyProfileView() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("gallery");
  const { data: me, isLoading, isError, refetch } = useMe();

  if (isLoading) {
    return (
      <div>
        {/* Header - mobile */}
        <div className="h-7xl gap-md bg-base-black px-xl flex items-center border-b border-neutral-900 md:hidden">
          <ArrowIcon className="size-6 rotate-180" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="size-10 shrink-0 rounded-full" />
        </div>

        <div className="custom-container mx-auto">
          <div className="gap-xl pt-xl pb-3xl md:pt-5xl mx-auto flex w-full max-w-203 flex-col items-start">
            <ProfileHeaderSkeleton />
            <div className="gap-2xl flex w-full flex-col items-start">
              <div className="flex w-full items-center">
                <div className="h-6xl flex flex-1 items-center justify-center border-b border-neutral-900" />
                <div className="h-6xl flex flex-1 items-center justify-center border-b border-neutral-900" />
              </div>
              <PostGridSkeleton />
            </div>
          </div>
        </div>

        <MobileBottomNav />
      </div>
    );
  }
  if (isError || !me) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div>
      {/* Header - mobile */}
      <div className="h-7xl bg-base-black px-xl flex items-center justify-between border-b border-neutral-900 md:hidden">
        <div className="gap-md flex flex-1 items-center">
          <button type="button" onClick={() => router.back()} aria-label="Back">
            <ArrowIcon className="size-6 rotate-180" />
          </button>
          <p className="text-md tracking-t-2 text-neutral-25 flex-1 font-bold">{me.name}</p>
        </div>
        <Avatar className="size-10">
          <AvatarImage src={me.avatarUrl ?? undefined} alt={me.name} />
          <AvatarFallback>{me.name?.[0]?.toUpperCase() ?? "?"}</AvatarFallback>
        </Avatar>
      </div>

      <div>
        <div className="custom-container mx-auto">
          <div className="gap-xl pt-xl pb-3xl md:pt-5xl mx-auto flex w-full max-w-203 flex-col items-start">
            {/* Post Container / Header */}
            <div className="gap-xl flex w-full flex-col items-start">
              <div className="gap-md flex w-full flex-col md:flex-row md:items-center md:justify-between">
                {/* User Info Container */}
                <div className="gap-md md:gap-2xl flex items-center md:items-end">
                  <UserAvatar src={me.avatarUrl} alt={me.name} className="size-16" />
                  <div className="text-neutral-25 flex flex-col items-start">
                    <p className="tracking-t-1 md:text-md md:tracking-t-2 text-sm font-bold">
                      {me.name}
                    </p>
                    <p className="tracking-t-2 md:text-md md:tracking-t-2 text-sm">{me.username}</p>
                  </div>
                </div>

                {/* Actions Container */}
                <div className="gap-lg flex w-full items-center md:w-auto">
                  <Button
                    variant="secondary"
                    render={<Link href="/me/edit" />}
                    className="md:h-6xl h-10 flex-1 md:w-32.5 md:flex-none"
                  >
                    Edit Profile
                  </Button>
                  <ShareDialog path={`/profile/${me.username}`}>
                    <button
                      type="button"
                      className="md:size-6xl flex size-10 shrink-0 items-center justify-center rounded-full border border-neutral-900"
                    >
                      <ShareIcon className="size-5 md:size-6" />
                    </button>
                  </ShareDialog>
                </div>
              </div>

              {me.bio && (
                <p className="tracking-t-2 text-neutral-25 md:text-md md:tracking-t-2 w-full text-sm">
                  {me.bio}
                </p>
              )}

              {/* Stats Container */}
              <div className="gap-3xl flex w-full items-center">
                <div className="gap-xxs flex flex-1 flex-col items-center text-center">
                  <p className="tracking-t-3 text-neutral-25 md:tracking-t-2 text-lg font-bold md:text-xl">
                    {me.counts.post}
                  </p>
                  <p className="md:text-md md:tracking-t-2 text-xs text-neutral-400">Post</p>
                </div>
                <div className="w-px self-stretch bg-neutral-900" />
                <Link
                  href="/me/followers"
                  className="gap-xxs flex flex-1 flex-col items-center text-center"
                >
                  <p className="tracking-t-3 text-neutral-25 md:tracking-t-2 text-lg font-bold md:text-xl">
                    {me.counts.followers}
                  </p>
                  <p className="md:text-md md:tracking-t-2 text-xs text-neutral-400">Followers</p>
                </Link>
                <div className="w-px self-stretch bg-neutral-900" />
                <Link
                  href="/me/following"
                  className="gap-xxs flex flex-1 flex-col items-center text-center"
                >
                  <p className="tracking-t-3 text-neutral-25 md:tracking-t-2 text-lg font-bold md:text-xl">
                    {me.counts.following}
                  </p>
                  <p className="md:text-md md:tracking-t-2 text-xs text-neutral-400">Following</p>
                </Link>
                <div className="w-px self-stretch bg-neutral-900" />
                <div className="gap-xxs flex flex-1 flex-col items-center text-center">
                  <p className="tracking-t-3 text-neutral-25 md:tracking-t-2 text-lg font-bold md:text-xl">
                    {me.counts.likes}
                  </p>
                  <p className="md:text-md md:tracking-t-2 text-xs text-neutral-400">Likes</p>
                </div>
              </div>
            </div>

            {/* Gallery Container */}
            <div className="gap-2xl flex w-full flex-col items-start">
              {/* Gallery Header (Tabs) */}
              <div className="flex w-full items-center">
                <button
                  type="button"
                  onClick={() => setTab("gallery")}
                  className={cn(
                    "h-6xl gap-md md:gap-lg px-2xl flex flex-1 items-center justify-center border-b",
                    tab === "gallery" ? "border-neutral-25 border-b-2" : "border-neutral-900"
                  )}
                >
                  <GridIcon className={cn("size-5 md:size-6", tab !== "gallery" && "opacity-50")} />
                  <p
                    className={cn(
                      "text-neutral-25 md:text-md text-sm font-bold",
                      tab === "gallery"
                        ? "tracking-t-1 md:tracking-t-2"
                        : "font-medium tracking-normal text-neutral-400"
                    )}
                  >
                    Gallery
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setTab("saved")}
                  className={cn(
                    "h-6xl gap-md md:gap-lg px-2xl flex flex-1 items-center justify-center border-b",
                    tab === "saved" ? "border-neutral-25 border-b-2" : "border-neutral-900"
                  )}
                >
                  <BookmarkIcon
                    className={cn(
                      "text-neutral-25 size-5 md:size-6",
                      tab !== "saved" && "opacity-50"
                    )}
                  />
                  <p
                    className={cn(
                      "text-neutral-25 md:text-md text-sm font-bold",
                      tab === "saved"
                        ? "tracking-t-1 md:tracking-t-2"
                        : "font-medium tracking-normal text-neutral-400"
                    )}
                  >
                    Saved
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setTab("likes")}
                  className={cn(
                    "h-6xl gap-md md:gap-lg px-2xl flex flex-1 items-center justify-center border-b",
                    tab === "likes" ? "border-neutral-25 border-b-2" : "border-neutral-900"
                  )}
                >
                  <HeartOutlineIcon
                    className={cn("size-5 md:size-6", tab !== "likes" && "opacity-50")}
                  />
                  <p
                    className={cn(
                      "text-neutral-25 md:text-md text-sm font-bold",
                      tab === "likes"
                        ? "tracking-t-1 md:tracking-t-2"
                        : "font-medium tracking-normal text-neutral-400"
                    )}
                  >
                    Likes
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setTab("settings")}
                  className={cn(
                    "h-6xl gap-md md:gap-lg px-2xl flex flex-1 items-center justify-center border-b",
                    tab === "settings" ? "border-neutral-25 border-b-2" : "border-neutral-900"
                  )}
                >
                  <Settings
                    className={cn(
                      "text-neutral-25 size-5 md:size-6",
                      tab !== "settings" && "opacity-50"
                    )}
                  />
                  <p
                    className={cn(
                      "text-neutral-25 md:text-md text-sm font-bold",
                      tab === "settings"
                        ? "tracking-t-1 md:tracking-t-2"
                        : "font-medium tracking-normal text-neutral-400"
                    )}
                  >
                    Settings
                  </p>
                </button>
              </div>

              {tab === "gallery" && <MyPostsGrid />}
              {tab === "saved" && <MySavedGrid />}
              {tab === "likes" && <MyLikesGrid />}
              {tab === "settings" && <SettingsPanel me={me} />}
            </div>
          </div>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
}

function MyPostsGrid() {
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

function MySavedGrid() {
  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMySaved();
  const posts = flattenPages(data?.pages, (page) => page.posts);
  if (isLoading) return <PostGridSkeleton />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (posts.length === 0) return <EmptyState title="No saved posts yet" />;
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

function MyLikesGrid() {
  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMyLikes();
  const posts = flattenPages(data?.pages, (page) => page.posts);
  if (isLoading) return <PostGridSkeleton />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (posts.length === 0) return <EmptyState title="No liked posts yet" />;
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
