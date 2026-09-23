"use client";

import Link from "next/link";

export function EmptyGallery() {
  return (
    <div className="gap-xl md:gap-3xl mx-auto flex h-93.75 w-full flex-col items-center justify-center pt-33 pb-42 md:h-auto md:w-113.25">
      <div className="gap-xs flex w-full flex-col items-center text-center">
        <p className="text-md tracking-t-2 text-neutral-25 md:tracking-t-3 font-bold md:text-lg">
          Your story starts here
        </p>
        <p className="tracking-t-2 md:text-md md:tracking-t-2 text-sm text-neutral-400">
          Share your first post and let the world see your moments, passions, and memories. Make
          this space truly yours.
        </p>
      </div>
      <Link
        href="/posts/create"
        className="bg-primary-300 p-md tracking-t-1 text-neutral-25 md:h-6xl md:text-md md:tracking-t-2 flex h-10 w-64.75 items-center justify-center rounded-full text-sm font-bold"
      >
        Upload My First Post
      </Link>
    </div>
  );
}
