"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowIcon, SearchIcon } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { InfiniteScrollSentinel } from "@/components/common/InfiniteScrollSentinel";
import { UserAvatar } from "@/components/user/UserAvatar";
import { UserRow } from "@/components/user/UserRow";
import { UserRowSkeleton } from "@/components/user/UserRowSkeleton";
import { useFollowList } from "@/hooks/follow/useFollowList";
import { useMe } from "@/hooks/user/useMe";
import { useUserProfile } from "@/hooks/user/useUserProfile";
import { flattenPages } from "@/lib/pagination";
import { cn } from "@/lib/utils";

interface FollowListPageProps {
  type: "followers" | "following";
  username?: string;
  /** Base path to switch tabs from, e.g. "/me" or "/profile/tonogw" */
  basePath: string;
}

export function FollowListPage({ type, username, basePath }: FollowListPageProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { data: myProfile } = useMe(!username);
  const { data: userProfile } = useUserProfile(username ?? "");
  const profile = username ? userProfile : myProfile;
  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFollowList({
      type,
      username,
    });
  const users = flattenPages(data?.pages, (page) => page.users);
  const normalizedQuery = query.trim().toLowerCase();
  const filteredUsers = normalizedQuery
    ? users.filter(
        (u) =>
          u.name.toLowerCase().includes(normalizedQuery) ||
          u.username.toLowerCase().includes(normalizedQuery)
      )
    : users;

  // Background pagination while searching
  useEffect(() => {
    if (normalizedQuery && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [normalizedQuery, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const emptyTitle = normalizedQuery
    ? "No results found"
    : type === "followers"
      ? "No followers yet"
      : "Not following anyone yet";

  return (
    <div className="w-full">
      {/* Header - mobile */}
      <div className="h-7xl bg-base-black px-xl flex w-full shrink-0 items-center justify-between border-b border-neutral-900 md:hidden">
        <div className="gap-md flex flex-1 items-center">
          <button type="button" onClick={() => router.back()} aria-label="Back">
            <ArrowIcon className="size-6 rotate-180" />
          </button>
          <p className="text-md tracking-t-2 text-neutral-25 flex-1 font-bold">
            {type === "followers" ? "Followers" : "Following"}
          </p>
        </div>
        <Avatar className="size-10">
          <AvatarImage src={profile?.avatarUrl ?? undefined} alt={profile?.name ?? ""} />
          <AvatarFallback>{profile?.name?.[0]?.toUpperCase() ?? "?"}</AvatarFallback>
        </Avatar>
      </div>

      <div className="custom-container mx-auto">
        <div className="gap-4xl pt-xl pb-3xl mx-auto flex w-full max-w-200 flex-col items-start md:pt-[clamp(16px,-11.43px+3.57vw,40px)]">
          {/* Header - desktop */}
          <div className="gap-lg hidden items-center md:flex">
            <button type="button" onClick={() => router.back()} aria-label="Back">
              <ArrowIcon className="size-8 rotate-180" />
            </button>
            <p className="font-display text-display-xs text-neutral-25 font-bold">
              {type === "followers" ? "Followers" : "Following"}
            </p>
          </div>

          <div className="gap-xl md:gap-6xl flex w-full flex-col items-center md:flex-row md:items-start">
            {/* Avatar */}
            <div className="gap-xl flex shrink-0 flex-col items-center">
              <UserAvatar
                src={profile?.avatarUrl}
                alt={profile?.name ?? ""}
                className="size-20 md:size-32.5"
              />
              <p className="text-md tracking-t-2 text-neutral-25 font-bold">{profile?.name}</p>
            </div>

            {/* Tabs + Search + List */}
            <div className="gap-xl flex w-full flex-col items-start md:w-[clamp(480px,297.14px+23.81vw,640px)]">
              {/* Tabs */}
              <div className="flex w-full items-center">
                <Link
                  href={`${basePath}/followers`}
                  replace
                  className={cn(
                    "h-6xl px-2xl flex flex-1 items-center justify-center border-b",
                    type === "followers" ? "border-neutral-25 border-b-2" : "border-neutral-900"
                  )}
                >
                  <p
                    className={cn(
                      "text-neutral-25 md:text-md text-sm font-bold",
                      type !== "followers" && "font-medium text-neutral-400"
                    )}
                  >
                    Followers
                  </p>
                </Link>
                <Link
                  href={`${basePath}/following`}
                  replace
                  className={cn(
                    "h-6xl px-2xl flex flex-1 items-center justify-center border-b",
                    type === "following" ? "border-neutral-25 border-b-2" : "border-neutral-900"
                  )}
                >
                  <p
                    className={cn(
                      "text-neutral-25 md:text-md text-sm font-bold",
                      type !== "following" && "font-medium text-neutral-400"
                    )}
                  >
                    Following
                  </p>
                </Link>
              </div>

              {/* Search */}
              <div className="h-5xl gap-sm px-lg py-md flex w-full items-center rounded-full border border-neutral-900 bg-neutral-950">
                <SearchIcon className="size-5 shrink-0" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Search"
                  placeholder="Search"
                  className="tracking-t-2 text-neutral-25 min-w-px flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-600"
                />
              </div>

              {/* List */}
              <div className="gap-2xl flex w-full flex-col items-start">
                {isLoading && (
                  <>
                    <UserRowSkeleton />
                    <UserRowSkeleton />
                    <UserRowSkeleton />
                  </>
                )}
                {isError && <ErrorState onRetry={() => refetch()} />}
                {!isLoading && !isError && filteredUsers.length === 0 && (
                  <EmptyState title={emptyTitle} />
                )}
                {filteredUsers.map((user) => (
                  <UserRow key={user.id} user={user} showFollowButton />
                ))}
                {!isLoading && !isError && !normalizedQuery && users.length > 0 && (
                  <InfiniteScrollSentinel
                    onIntersect={() => fetchNextPage()}
                    enabled={!!hasNextPage && !isFetchingNextPage}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
