"use client";

import { useState } from "react";
import { EmojiPicker } from "@/components/comment/EmojiPicker";
import { useAddComment } from "@/hooks/comment/useComments";
import { cn } from "@/lib/utils";

interface CommentComposerProps {
  postId: number;
}

export function CommentComposer({ postId }: CommentComposerProps) {
  const [text, setText] = useState("");
  const addComment = useAddComment(postId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    addComment.mutate(trimmed);
    setText("");
  }

  return (
    <form onSubmit={handleSubmit} className="gap-md flex w-full items-start">
      <EmojiPicker onSelect={(emoji) => setText((t) => t + emoji)} />
      <div className="h-6xl gap-md px-xl py-md flex w-full items-center rounded-xl border border-neutral-900 bg-neutral-950">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add Comment"
          className="tracking-t-1 text-neutral-25 md:text-md md:tracking-t-2 min-w-px flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-neutral-600"
        />
        <button
          type="submit"
          disabled={addComment.isPending || !text.trim()}
          className={cn(
            "tracking-t-1 md:text-md md:tracking-t-2 shrink-0 text-sm font-bold disabled:opacity-50",
            text.trim() ? "text-primary-200" : "text-neutral-600"
          )}
        >
          Post
        </button>
      </div>
    </form>
  );
}
