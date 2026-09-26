"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const loadPanel = () =>
  import("@/components/post/ShareDialogPanel").then((m) => m.ShareDialogPanel);
const ShareDialogPanel = dynamic(loadPanel, { ssr: false });

const PRELOAD_DELAY_MS = 8000;

interface ShareDialogProps {
  path: string;
  children: React.ReactNode;
}

export function ShareDialog({ path, children }: ShareDialogProps) {
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
      {requested && <ShareDialogPanel path={path} open={open} onOpenChange={setOpen} />}
    </>
  );
}
