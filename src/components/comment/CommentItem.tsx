"use client";

import { UserAvatar } from "@/components/user/UserAvatar";
import { useAuth } from "@/hooks/auth/useAuth";
import { useDeleteComment } from "@/hooks/comment/useComments";
import { formatRelativeTime } from "@/lib/format";
import type { Comment } from "@/types/api";

interface CommentItemProps {
  postId: number;
  postAuthorId: number;
  comment: Comment;
}

export function CommentItem({ postId, postAuthorId, comment }: CommentItemProps) {
  const { user } = useAuth();
  const deleteComment = useDeleteComment(postId);
  const canDelete = user?.id === comment.author.id || user?.id === postAuthorId;

  return (
    <div className="gap-md pb-md flex w-full flex-col items-start border-b border-neutral-900 last:border-b-0 md:gap-2.5">
      <div className="gap-md flex w-full items-center">
        <UserAvatar src={comment.author.avatarUrl} alt={comment.author.name} className="size-10" />
        <div className="flex min-w-px flex-1 flex-col items-start justify-center">
          <p className="-mb-xs text-neutral-25 md:-mb-xxs md:tracking-t-1 text-xs font-semibold md:text-sm md:font-bold">
            {comment.author.name}
          </p>
          <p className="tracking-t-3 md:tracking-t-none text-xs text-neutral-400">
            {formatRelativeTime(comment.createdAt)}
          </p>
        </div>
        {canDelete && (
          <button
            type="button"
            onClick={() => deleteComment.mutate(comment.id)}
            disabled={deleteComment.isPending}
            className="text-accent-red shrink-0 text-xs disabled:opacity-50"
          >
            Delete
          </button>
        )}
      </div>
      <p className="tracking-t-3 text-neutral-25 md:tracking-t-2 w-full text-xs md:text-sm">
        {comment.text}
      </p>
    </div>
  );
}
