"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { CreatePostView } from "@/components/post/CreatePostView";
import { CloseIcon } from "@/components/icons";
import { useModalA11y } from "@/hooks/common/useModalA11y";

export default function CreatePostModal() {
  const router = useRouter();
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  // Scroll lock
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useModalA11y(panelRef, () => router.back());

  // Stale slot guard
  if (pathname !== "/posts/create") return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-neutral-950/80 pt-[clamp(75px,64.49px+2.6743vw,103px)] md:justify-center"
      onClick={() => router.back()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className="custom-container gap-md mx-auto flex w-full flex-col outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Close"
          className="flex size-6 items-center justify-center self-end"
        >
          <CloseIcon className="size-6" />
        </button>
        <div className="max-h-[80vh] scrollbar-none overflow-y-auto bg-neutral-950 max-md:rounded-t-2xl">
          <CreatePostView variant="modal" />
        </div>
      </div>
    </div>
  );
}
