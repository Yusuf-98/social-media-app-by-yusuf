"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircleIcon } from "@/components/icons";
import { UserAvatar } from "@/components/user/UserAvatar";
import { useAuth } from "@/hooks/auth/useAuth";
import { useFollowToggle } from "@/hooks/follow/useFollowToggle";
import { cn } from "@/lib/utils";
import type { UserSummary } from "@/types/api";

interface UserRowProps {
  user: UserSummary;
  showFollowButton?: boolean;
}

export function UserRow({ user, showFollowButton = false }: UserRowProps) {
  const router = useRouter();
  const { isAuthenticated, user: currentUser } = useAuth();
  const isSelf = user.isMe || currentUser?.id === user.id;
  const followToggle = useFollowToggle({
    username: user.username,
    isFollowing: user.isFollowedByMe,
  });

  return (
    <div className="gap-md flex w-full items-center justify-between">
      <Link href={`/profile/${user.username}`} className="gap-md flex min-w-0 flex-1 items-center">
        <UserAvatar src={user.avatarUrl} alt={user.name} className="size-12" />
        <div className="flex min-w-px flex-1 flex-col items-start justify-center text-sm">
          <p className="tracking-t-1 text-neutral-25 w-full truncate font-bold">{user.name}</p>
          <p className="tracking-t-2 w-full truncate text-neutral-400">{user.username}</p>
        </div>
      </Link>
      {showFollowButton && !isSelf && (
        <button
          type="button"
          onClick={() => {
            if (!isAuthenticated) {
              router.push(`/login?returnTo=/profile/${user.username}`);
              return;
            }
            followToggle.mutate();
          }}
          disabled={followToggle.isPending}
          className={cn(
            "gap-md px-3xl py-md focus-visible:ring-primary-200/50 flex h-10 shrink-0 items-center justify-center rounded-full outline-none focus-visible:ring-2",
            user.isFollowedByMe ? "border border-neutral-900" : "bg-primary-300",
            followToggle.isPending && "opacity-50"
          )}
        >
          {user.isFollowedByMe && <CheckCircleIcon className="size-5" />}
          <span className="tracking-t-1 text-neutral-25 text-sm font-bold whitespace-nowrap">
            {user.isFollowedByMe ? "Following" : "Follow"}
          </span>
        </button>
      )}
    </div>
  );
}
