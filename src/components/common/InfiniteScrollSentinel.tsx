"use client";

import { useEffect, useRef } from "react";

interface InfiniteScrollSentinelProps {
  onIntersect: () => void;
  enabled?: boolean;
  rootMargin?: string;
}

export function InfiniteScrollSentinel({
  onIntersect,
  enabled = true,
  rootMargin = "200px",
}: InfiniteScrollSentinelProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onIntersect();
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [onIntersect, enabled, rootMargin]);

  return <div ref={ref} className="h-px w-full" />;
}
