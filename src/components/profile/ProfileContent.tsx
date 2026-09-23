"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { CheckCircleIcon, GridIcon, HeartOutlineIcon, ShareIcon } from "@/components/icons";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { InfiniteScrollSentinel } from "@/components/common/InfiniteScrollSentinel";
import { NotFoundState } from "@/components/common/NotFoundState";
import { PostGrid } from "@/components/post/PostGrid";
import { PostGridSkeleton } from "@/components/post/PostGridSkeleton";
import { ShareDialog } from "@/components/post/ShareDialog";
import { ProfileHeaderSkeleton } from "@/components/profile/ProfileHeaderSkeleton";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user/UserAvatar";
import { useAuth } from "@/hooks/auth/useAuth";
import { useFollowToggle } from "@/hooks/follow/useFollowToggle";
import { useUserLikes, useUserPosts, useUserProfile } from "@/hooks/user/useUserProfile";
import { ApiError } from "@/lib/api/client";
import { flattenPages } from "@/lib/pagination";
import { cn } from "@/lib/utils";

type Tab = "gallery" | "liked";

interface ProfileContentProps {
  username: string;
}

export function ProfileContent({ username }: ProfileContentProps) {
  const [tab, setTab] = useState<Tab>("gallery");
  const router = useRouter();
  const galleryTabRef = useRef<HTMLButtonElement>(null);
  const likedTabRef = useRef<HTMLButtonElement>(null);

  function moveTab(next: Tab) {
    setTab(next);
    (next === "gallery" ? galleryTabRef : likedTabRef).current?.focus();
  }

  const { data: profile, isLoading, isError, error, refetch } = useUserProfile(username);
  const { isAuthenticated } = useAuth();
  const followToggle = useFollowToggle({ username, isFollowing: profile?.isFollowing ?? false });

  if (isLoading) {
    return (
      <div className="custom-container mx-auto">
        <div className="gap-xl py-3xl mx-auto flex w-full max-w-203 flex-col items-start">
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
    );
  }
  if (error instanceof ApiError && error.status === 404) {
    return (
      <NotFoundState
        title="User not found"
        description={`No account with username "${username}".`}
      />
    );
  }
  if (isError || !profile) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="custom-container mx-auto">
      <div className="gap-xl py-3xl mx-auto flex w-full max-w-203 flex-col items-start">
        {/* Post Container / Header */}
        <div className="gap-xl flex w-full flex-col items-start">
          <div className="gap-md flex w-full flex-col md:flex-row md:items-center md:justify-between">
            {/* User Info Container */}
            <div className="gap-md md:gap-2xl flex items-center md:items-end">
              <UserAvatar src={profile.avatarUrl} alt={profile.name} className="size-16" />
              <div className="text-md tracking-t-2 text-neutral-25 flex flex-col items-start">
                <p className="font-bold">{profile.name}</p>
                <p>{profile.username}</p>
              </div>
            </div>

            {/* Actions Container */}
            <div className="gap-md flex w-full items-center md:w-auto">
              {profile.isMe ? (
                <Button
                  variant="secondary"
                  render={<Link href="/me/edit" />}
                  className="md:h-6xl h-10 flex-1 md:w-32.5 md:flex-none"
                >
                  Edit Profile
                </Button>
              ) : (
                <Button
                  variant={profile.isFollowing ? "secondary" : "primary"}
                  onClick={() => {
                    if (!isAuthenticated) {
                      router.push(`/login?returnTo=/profile/${username}`);
                      return;
                    }
                    followToggle.mutate();
                  }}
                  disabled={followToggle.isPending}
                  className="md:h-6xl md:px-2xl h-10 flex-1 md:flex-none"
                >
                  {profile.isFollowing && <CheckCircleIcon className="size-5" />}
                  {profile.isFollowing ? "Following" : "Follow"}
                </Button>
              )}
              <ShareDialog path={`/profile/${username}`}>
                <button
                  type="button"
                  aria-label="Share"
                  className="md:size-6xl flex size-10 shrink-0 items-center justify-center rounded-full border border-neutral-900"
                >
                  <ShareIcon className="size-5 md:size-6" />
                </button>
              </ShareDialog>
            </div>
          </div>

          {profile.bio && (
            <p className="tracking-t-2 text-neutral-25 md:text-md md:tracking-t-2 w-full text-sm">
              {profile.bio}
            </p>
          )}

          {/* Stats Container */}
          <div className="gap-3xl flex w-full items-center">
            <div className="gap-xxs flex flex-1 flex-col items-center text-center">
              <p className="tracking-t-3 text-neutral-25 md:tracking-t-2 text-lg font-bold md:text-xl">
                {profile.counts.post}
              </p>
              <p className="md:text-md text-xs text-neutral-400">Post</p>
            </div>
            <div className="h-8 w-px bg-neutral-900" />
            <Link
              href={`/profile/${username}/followers`}
              className="gap-xxs flex flex-1 flex-col items-center text-center"
            >
              <p className="tracking-t-3 text-neutral-25 md:tracking-t-2 text-lg font-bold md:text-xl">
                {profile.counts.followers}
              </p>
              <p className="md:text-md text-xs text-neutral-400">Followers</p>
            </Link>
            <div className="h-8 w-px bg-neutral-900" />
            <Link
              href={`/profile/${username}/following`}
              className="gap-xxs flex flex-1 flex-col items-center text-center"
            >
              <p className="tracking-t-3 text-neutral-25 md:tracking-t-2 text-lg font-bold md:text-xl">
                {profile.counts.following}
              </p>
              <p className="md:text-md text-xs text-neutral-400">Following</p>
            </Link>
            <div className="h-8 w-px bg-neutral-900" />
            <div className="gap-xxs flex flex-1 flex-col items-center text-center">
              <p className="tracking-t-3 text-neutral-25 md:tracking-t-2 text-lg font-bold md:text-xl">
                {profile.counts.likes}
              </p>
              <p className="md:text-md text-xs text-neutral-400">Likes</p>
            </div>
          </div>
        </div>

        {/* Gallery Container */}
        <div className="gap-2xl flex w-full flex-col items-start">
          {/* Gallery Header (Tabs) */}
          <div
            role="tablist"
            aria-label="Profile content"
            className="flex w-full items-center"
            onKeyDown={(e) => {
              if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
              e.preventDefault();
              moveTab(tab === "gallery" ? "liked" : "gallery");
            }}
          >
            <button
              ref={galleryTabRef}
              type="button"
              role="tab"
              id="tab-gallery"
              aria-selected={tab === "gallery"}
              aria-controls="tabpanel-gallery"
              tabIndex={tab === "gallery" ? 0 : -1}
              onClick={() => setTab("gallery")}
              className={cn(
                "h-6xl gap-sm px-2xl flex flex-1 items-center justify-center border-b",
                tab === "gallery" ? "border-neutral-25 border-b-2" : "border-neutral-900"
              )}
            >
              <GridIcon className={cn("size-5 md:size-6", tab !== "gallery" && "opacity-50")} />
              <p
                className={cn(
                  "text-neutral-25 md:text-md text-sm font-bold",
                  tab !== "gallery" && "font-medium text-neutral-400"
                )}
              >
                Gallery
              </p>
            </button>
            <button
              ref={likedTabRef}
              type="button"
              role="tab"
              id="tab-liked"
              aria-selected={tab === "liked"}
              aria-controls="tabpanel-liked"
              tabIndex={tab === "liked" ? 0 : -1}
              onClick={() => setTab("liked")}
              className={cn(
                "h-6xl gap-sm px-2xl flex flex-1 items-center justify-center border-b",
                tab === "liked" ? "border-neutral-25 border-b-2" : "border-neutral-900"
              )}
            >
              <HeartOutlineIcon
                className={cn("size-5 md:size-6", tab !== "liked" && "opacity-50")}
              />
              <p
                className={cn(
                  "text-neutral-25 md:text-md text-sm font-bold",
                  tab !== "liked" && "font-medium text-neutral-400"
                )}
              >
                Liked
              </p>
            </button>
          </div>

          {tab === "gallery" && (
            <div role="tabpanel" id="tabpanel-gallery" aria-labelledby="tab-gallery" className="w-full">
              <UserPostsGrid username={username} />
            </div>
          )}
          {tab === "liked" && (
            <div role="tabpanel" id="tabpanel-liked" aria-labelledby="tab-liked" className="w-full">
              <UserLikesGrid username={username} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UserPostsGrid({ username }: { username: string }) {
  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useUserPosts(username);
  const posts = flattenPages(data?.pages, (page) => page.posts);
  if (isLoading) return <PostGridSkeleton />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (posts.length === 0) return <EmptyState title="No posts yet" />;
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

function UserLikesGrid({ username }: { username: string }) {
  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useUserLikes(username);
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
