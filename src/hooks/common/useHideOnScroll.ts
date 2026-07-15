"use client";

import { useEffect, useRef, useState } from "react";

export function useHideOnScroll(threshold = 10) {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    function onScroll() {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const delta = currentScrollY - lastScrollY.current;

        if (currentScrollY <= 0) {
          setVisible(true);
          lastScrollY.current = currentScrollY;
        } else if (Math.abs(delta) > threshold) {
          setVisible(delta < 0);
          lastScrollY.current = currentScrollY;
        }
        ticking.current = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return visible;
}
