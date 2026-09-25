"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  HeartFilledIcon,
  HeartOutlineIcon,
  MessageIcon,
  MoreIcon,
  ShareIcon,
} from "@/components/icons";
import { BookmarkIcon } from "@/components/icons/BookmarkIcon";
import { CommentComposer } from "@/components/comment/CommentComposer";
import { CommentItem } from "@/components/comment/CommentItem";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { InfiniteScrollSentinel } from "@/components/common/InfiniteScrollSentinel";
import { CommentItemSkeleton } from "@/components/comment/CommentItemSkeleton";
import { PostDetailSkeleton } from "@/components/post/PostDetailSkeleton";
import { NotFoundState } from "@/components/common/NotFoundState";
import { LikedByDialog } from "@/components/post/LikedByDialog";
import { PostImage } from "@/components/post/PostImage";
import { ShareDialog } from "@/components/post/ShareDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/user/UserAvatar";
import { useAuth } from "@/hooks/auth/useAuth";
import { useComments } from "@/hooks/comment/useComments";
import { useDeletePost } from "@/hooks/post/useDeletePost";
import { useLikeToggle } from "@/hooks/post/useLikeToggle";
import { usePost } from "@/hooks/post/usePost";
import { useSaveToggle } from "@/hooks/post/useSaveToggle";
import { trackEvent } from "@/lib/analytics";
import { ApiError } from "@/lib/api/client";
import { formatRelativeTime } from "@/lib/format";
import { flattenPages } from "@/lib/pagination";
import { cn } from "@/lib/utils";

interface PostDetailContentProps {
  postId: number;
  variant?: "page" | "modal";
}

export function PostDetailContent({ postId, variant = "page" }: PostDetailContentProps) {
  const router = useRouter();
  const isModalSheet = variant === "modal";
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: post, isLoading, isError, error, refetch } = usePost(postId);
  const { isAuthenticated, user } = useAuth();
  const commentsQuery = useComments(postId);
  const deletePost = useDeletePost();

  const likeToggle = useLikeToggle(post ?? { id: postId, likedByMe: false, likeCount: 0 });
  const saveToggle = useSaveToggle(post ?? { id: postId, savedByMe: false });

  const comments = flattenPages(commentsQuery.data?.pages, (page) => page.comments);

  useEffect(() => {
    if (post) trackEvent("view_post", { postId: post.id });
  }, [post]);

  if (isLoading) return <PostDetailSkeleton />;
  if (error instanceof ApiError && error.status === 404) {
    return <NotFoundState title="Post not found" description="This post may have been deleted." />;
  }
  if (isError || !post) return <ErrorState onRetry={() => refetch()} />;

  function requireAuth(action: () => void) {
    if (!isAuthenticated) {
      router.push(`/login?returnTo=/posts/${postId}`);
      return;
    }
    action();
  }

  return (
    <div
      className={cn(
        "gap-3xl mx-auto flex w-full max-w-300 flex-col lg:grid lg:aspect-5/3 lg:grid-cols-[3fr_2fr] lg:items-stretch lg:gap-0",
        isModalSheet && "max-md:h-full"
      )}
    >
      {/* Image */}
      <div className="relative aspect-square w-full min-w-0 bg-neutral-950">
        <PostImage
          post={post}
          sizes="(min-width: 1024px) 720px, 100vw"
          className="object-contain"
          loading="eager"
        />
      </div>

      {/* Post Container */}
      <div
        className={cn(
          "lg:p-2xl flex w-full min-w-0 flex-col items-start gap-11.5",
          isModalSheet && "max-lg:gap-lg max-lg:px-xl max-lg:pt-xl max-lg:pb-4xl"
        )}
      >
        {/* Post Content */}
        <div
          className={cn(
            "gap-xl flex min-h-0 w-full flex-1 flex-col items-start",
            isModalSheet && "max-md:gap-lg"
          )}
        >
          {/* Post Header */}
          <div className="gap-sm flex w-full flex-col items-start">
            <div className="flex w-full items-center justify-between">
              <Link
                href={`/profile/${post.author.username}`}
                className="flex items-center gap-3.25"
              >
                <UserAvatar
                  src={post.author.avatarUrl}
                  alt={post.author.name}
                  className="size-10"
                />
                <div className="gap-xxs flex flex-col items-start">
                  <p className="tracking-t-1 text-neutral-25 text-sm font-bold">
                    {post.author.name}
                  </p>
                  <p suppressHydrationWarning className="text-xs text-neutral-400">
                    {formatRelativeTime(post.createdAt)}
                  </p>
                </div>
              </Link>
              {user?.id === post.author.id && (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    aria-label="Post options"
                    className="flex size-6 items-center justify-center"
                  >
                    <MoreIcon className="size-6" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      variant="destructive"
                      disabled={deletePost.isPending}
                      onClick={() => setDeleteDialogOpen(true)}
                    >
                      Delete post
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Delete this post?"
                description="This action cannot be undone."
                isPending={deletePost.isPending}
                onConfirm={() => {
                  deletePost.mutate(postId, {
                    onSuccess: () => {
                      setDeleteDialogOpen(false);
                      toast.success("Post deleted");
                      router.push("/feed");
                    },
                    onError: (err) => {
                      toast.error(err instanceof ApiError ? err.message : "Failed to delete post");
                    },
                  });
                }}
              />
            </div>
            {post.caption && (
              <p className="tracking-t-2 text-neutral-25 line-clamp-5 w-full text-sm">
                {post.caption}
              </p>
            )}
          </div>

          <div className="h-px w-full bg-neutral-900" />

          {/* Comments Section */}
          <div
            className={cn("gap-xl flex w-full flex-col items-start", isModalSheet && "max-md:gap-lg")}
          >
            <p className="text-md tracking-t-2 text-neutral-25 font-bold">Comments</p>

            <div
              className={cn(
                "gap-xl flex max-h-100 w-full scrollbar-none flex-col items-start overflow-y-auto",
                isModalSheet && "max-md:gap-lg"
              )}
            >
              {commentsQuery.isLoading && (
                <>
                  <CommentItemSkeleton />
                  <CommentItemSkeleton />
                  <CommentItemSkeleton />
                </>
              )}
              {commentsQuery.isError && <ErrorState onRetry={() => commentsQuery.refetch()} />}
              {!commentsQuery.isLoading && !commentsQuery.isError && comments.length === 0 && (
                <EmptyState title="No comments yet" description="Be the first to comment." />
              )}
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  postId={postId}
                  postAuthorId={post.author.id}
                  comment={comment}
                />
              ))}
              {!commentsQuery.isLoading && !commentsQuery.isError && (
                <InfiniteScrollSentinel
                  onIntersect={() => commentsQuery.fetchNextPage()}
                  enabled={!!commentsQuery.hasNextPage && !commentsQuery.isFetchingNextPage}
                />
              )}
            </div>
          </div>
        </div>

        {/* Actions Container */}
        <div className="gap-xl flex w-full flex-col items-start">
          {/* Actions Row */}
          <div className="flex w-full items-center justify-between">
            <div className="gap-xl flex items-center">
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
                <LikedByDialog postId={postId}>
                  <p className="text-md tracking-t-2 text-neutral-25 cursor-pointer font-semibold">
                    {post.likeCount}
                  </p>
                </LikedByDialog>
              </div>
              <div className="gap-sm flex items-center">
                <MessageIcon className="size-6 shrink-0" />
                <p className="text-md tracking-t-2 text-neutral-25 font-semibold">
                  {post.commentCount}
                </p>
              </div>
              <ShareDialog path={`/posts/${postId}`}>
                <button type="button" aria-label="Share" className="gap-sm flex items-center">
                  <ShareIcon className="size-6 shrink-0" />
                </button>
              </ShareDialog>
            </div>
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

          {/* Composer */}
          {isAuthenticated ? (
            <CommentComposer postId={postId} />
          ) : (
            <Link
              href={`/login?returnTo=/posts/${postId}`}
              className="text-md text-primary-150 font-bold"
            >
              Log in to comment
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
