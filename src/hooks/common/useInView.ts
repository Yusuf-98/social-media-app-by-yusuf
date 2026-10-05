"use client";

import { useEffect, useState, type RefObject } from "react";

export function useInView(ref: RefObject<Element | null>, rootMargin = "0px", enabled = true) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!enabled || inView) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setInView(true);
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin, enabled, inView]);

  return inView;
}
