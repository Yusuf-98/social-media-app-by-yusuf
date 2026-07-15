"use client";

import { usePathname, useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { PostDetailContent } from "@/components/post/PostDetailContent";
import { CloseIcon } from "@/components/icons";

export default function PostDetailModal() {
  const params = useParams<{ id: string }>();
  const postId = Number(params.id);
  const router = useRouter();
  const pathname = usePathname();

  // Scroll lock
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Stale slot guard
  if (!pathname.startsWith(`/posts/${params.id}`)) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-neutral-950/80 pt-[clamp(75px,64.49px+2.6743vw,103px)] md:justify-center"
      onClick={() => router.back()}
    >
      <div
        className="custom-container gap-md md:gap-3xl mx-auto flex w-full flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => router.back()}
          className="flex size-6 items-center justify-center self-end"
        >
          <CloseIcon className="size-6" />
        </button>
        <div className="flex max-h-[75vh] scrollbar-none flex-col overflow-y-auto bg-neutral-950 max-md:rounded-t-2xl">
          <PostDetailContent postId={postId} variant="modal" />
        </div>
      </div>
    </div>
  );
}
