"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { HeartFilledIcon, HeartOutlineIcon, MessageIcon, ShareIcon } from "@/components/icons";
import { BookmarkIcon } from "@/components/icons/BookmarkIcon";
import { LikedByDialog } from "@/components/post/LikedByDialog";
import { PostImage } from "@/components/post/PostImage";
import { ShareDialog } from "@/components/post/ShareDialog";
import { UserAvatar } from "@/components/user/UserAvatar";
import { useAuth } from "@/hooks/auth/useAuth";
import { useLikeToggle } from "@/hooks/post/useLikeToggle";
import { useSaveToggle } from "@/hooks/post/useSaveToggle";
import { formatRelativeTime } from "@/lib/format";
import type { Post } from "@/types/api";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  priorityImage?: boolean;
}

export function PostCard({ post, priorityImage = false }: PostCardProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const likeToggle = useLikeToggle(post);
  const saveToggle = useSaveToggle(post);

  function requireAuth(action: () => void) {
    if (!isAuthenticated) {
      router.push(`/login?returnTo=${encodeURIComponent(`/posts/${post.id}`)}`);
      return;
    }
    action();
  }

  return (
    <div className="gap-md md:gap-lg flex w-full flex-col items-start">
      {/* Post Container */}
      <div className="gap-md md:gap-lg flex w-full flex-col items-start">
        {/* Header */}
        <div className="flex w-full items-center">
          <Link
            href={`/profile/${post.author.username}`}
            className="gap-md md:gap-lg flex items-center"
          >
            <UserAvatar
              src={post.author.avatarUrl}
              alt={post.author.name}
              className="size-11 md:size-[clamp(44px,21.14px+2.98vw,64px)]"
            />
            {/* User Info */}
            <div className="flex min-w-px flex-1 flex-col items-start">
              <p className="tracking-t-1 text-neutral-25 md:text-md md:tracking-t-2 w-full text-sm font-bold">
                {post.author.name}
              </p>
              <p
                suppressHydrationWarning
                className="md:tracking-t-2 w-full text-xs text-neutral-400 md:text-sm"
              >
                {formatRelativeTime(post.createdAt)}
              </p>
            </div>
          </Link>
        </div>

        {/* Image */}
        <Link
          href={`/posts/${post.id}`}
          className="block max-h-150 w-full overflow-hidden rounded-md bg-neutral-950"
        >
          <PostImage
            post={post}
            natural
            sizes="(min-width: 768px) 600px, 100vw"
            className="max-h-150 object-contain"
            loading={priorityImage ? "eager" : "lazy"}
            fetchPriority={priorityImage ? "high" : undefined}
          />
        </Link>
      </div>

      {/* Actions */}
      <div className="flex w-full items-center justify-between">
        <div className="gap-lg md:gap-xl flex items-center">
          {/* Likes */}
          <div className="gap-sm flex items-center">
            <button
              type="button"
              onClick={() => requireAuth(() => likeToggle.mutate())}
              disabled={likeToggle.isPending}
              aria-label={post.likedByMe ? "Unlike" : "Like"}
            >
              {post.likedByMe ? (
                <HeartFilledIcon className="size-6 shrink-0" />
              ) : (
                <HeartOutlineIcon className="size-6 shrink-0" />
              )}
            </button>
            <LikedByDialog postId={post.id}>
              <p className="tracking-t-2 text-neutral-25 md:text-md md:tracking-t-2 cursor-pointer text-sm font-semibold">
                {post.likeCount}
              </p>
            </LikedByDialog>
          </div>

          {/* Comments */}
          <Link href={`/posts/${post.id}`} className="gap-sm flex items-center">
            <MessageIcon className="size-6 shrink-0" />
            <p className="tracking-t-2 text-neutral-25 md:text-md md:tracking-t-2 text-sm font-semibold">
              {post.commentCount}
            </p>
          </Link>

          {/* Shares */}
          <ShareDialog path={`/posts/${post.id}`}>
            <button type="button" aria-label="Share" className="gap-sm flex items-center">
              <ShareIcon className="size-6 shrink-0" />
            </button>
          </ShareDialog>
        </div>

        {/* Save */}
        <button
          type="button"
          onClick={() =>
            requireAuth(() => {
              const wasSaved = post.savedByMe;
              saveToggle.mutate(undefined, {
                onSuccess: () => toast.success(wasSaved ? "Removed from saved" : "Saved"),
              });
            })
          }
          disabled={saveToggle.isPending}
          aria-label={post.savedByMe ? "Unsave" : "Save"}
        >
          <BookmarkIcon filled={post.savedByMe} className="text-neutral-25 size-6" />
        </button>
      </div>

      {/* Post Content */}
      <div className="tracking-t-1 md:gap-xs md:text-md md:tracking-t-2 flex w-full flex-col items-start gap-0 text-sm md:w-131.5">
        <p className="text-neutral-25 w-full font-bold">{post.author.name}</p>
        {post.caption && (
          <p className={cn("text-neutral-25 w-full", !expanded && "line-clamp-2")}>
            {post.caption}
          </p>
        )}
        {post.caption && post.caption.length > 80 && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-primary-150 font-bold md:font-semibold"
          >
            {expanded ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
    </div>
  );
}
