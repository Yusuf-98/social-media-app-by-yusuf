"use client";

import { useState } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { InfiniteScrollSentinel } from "@/components/common/InfiniteScrollSentinel";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserRow } from "@/components/user/UserRow";
import { UserRowSkeleton } from "@/components/user/UserRowSkeleton";
import { usePostLikers } from "@/hooks/post/usePostLikers";
import { flattenPages } from "@/lib/pagination";

interface LikedByDialogProps {
  postId: number;
  children: React.ReactNode;
}

export function LikedByDialog({ postId, children }: LikedByDialogProps) {
  const [open, setOpen] = useState(false);
  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePostLikers(postId, open);
  const users = flattenPages(data?.pages, (page) => page.users);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <span onClick={() => setOpen(true)} className="cursor-pointer">
        {children}
      </span>
      <DialogContent className="max-h-135 scrollbar-none overflow-y-auto md:w-137 md:max-w-137">
        <DialogHeader>
          <DialogTitle>Likes</DialogTitle>
        </DialogHeader>
        <div className="gap-2xl flex w-full flex-col items-start">
          {isLoading && (
            <>
              <UserRowSkeleton />
              <UserRowSkeleton />
              <UserRowSkeleton />
            </>
          )}
          {isError && <ErrorState onRetry={() => refetch()} />}
          {!isLoading && !isError && users.length === 0 && <EmptyState title="No likes yet" />}
          {users.map((user) => (
            <UserRow key={user.id} user={user} showFollowButton />
          ))}
          {!isLoading && !isError && users.length > 0 && (
            <InfiniteScrollSentinel
              onIntersect={() => fetchNextPage()}
              enabled={!!hasNextPage && !isFetchingNextPage}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
