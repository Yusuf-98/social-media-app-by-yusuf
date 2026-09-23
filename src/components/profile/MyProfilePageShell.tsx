"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowIcon, ShareIcon } from "@/components/icons";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ErrorState } from "@/components/common/ErrorState";
import { ShareDialog } from "@/components/post/ShareDialog";
import { ProfileHeaderSkeleton } from "@/components/profile/ProfileHeaderSkeleton";
import { PostGridSkeleton } from "@/components/post/PostGridSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user/UserAvatar";
import { MyProfileTabs } from "@/components/profile/MyProfileTabs";
import { useMe } from "@/hooks/user/useMe";

type Tab = "gallery" | "saved" | "likes" | "settings";

interface MyProfilePageShellProps {
  activeTab: Tab;
  children: React.ReactNode;
}

export function MyProfilePageShell({ activeTab, children }: MyProfilePageShellProps) {
  const router = useRouter();
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
                      aria-label="Share"
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
              <MyProfileTabs active={activeTab} />
              {children}
            </div>
          </div>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
}
