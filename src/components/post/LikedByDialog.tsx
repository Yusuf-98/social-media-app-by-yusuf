"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const loadPanel = () =>
  import("@/components/post/LikedByDialogPanel").then((m) => m.LikedByDialogPanel);
const LikedByDialogPanel = dynamic(loadPanel, { ssr: false });

const PRELOAD_DELAY_MS = 8000;

interface LikedByDialogProps {
  postId: number;
  children: React.ReactNode;
}

export function LikedByDialog({ postId, children }: LikedByDialogProps) {
  const [open, setOpen] = useState(false);
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(loadPanel, PRELOAD_DELAY_MS);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <>
      {/* Trigger */}
      <span
        onClick={() => {
          setRequested(true);
          setOpen(true);
        }}
        onPointerEnter={loadPanel}
        onFocus={loadPanel}
        className="cursor-pointer"
      >
        {children}
      </span>

      {/* Panel */}
      {requested && <LikedByDialogPanel postId={postId} open={open} onOpenChange={setOpen} />}
    </>
  );
}
