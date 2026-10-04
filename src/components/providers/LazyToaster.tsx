"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { registerToasterMount } from "@/lib/notify";

export function LazyToaster() {
  const [Toaster, setToaster] = useState<ComponentType | null>(null);
  const resolveMount = useRef<(() => void) | null>(null);

  useEffect(() => {
    registerToasterMount(
      () =>
        new Promise<void>((resolve) => {
          resolveMount.current = resolve;
          void import("@/components/ui/sonner").then((m) => setToaster(() => m.Toaster));
        })
    );
  }, []);

  useEffect(() => {
    if (Toaster) resolveMount.current?.();
  }, [Toaster]);

  return Toaster ? <Toaster /> : null;
}
