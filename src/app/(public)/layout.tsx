"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Navbar } from "@/components/layout/Navbar";
import { cn } from "@/lib/utils";

export default function PublicLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const pathname = usePathname();
  const isModalRoute = /^\/posts\/\d+$/.test(pathname) || pathname === "/posts/create";
  // Navbar visibility
  const hasOwnMobileHeader =
    /^\/profile\/[^/]+\/(followers|following)$/.test(pathname) || pathname === "/posts/create";

  // Pin background page during modal
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [pinnedChildren, setPinnedChildren] = useState(children);
  const [showModal, setShowModal] = useState(false);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    if (isModalRoute) {
      setShowModal(true);
    } else {
      setPinnedChildren(children);
      setShowModal(false);
    }
  }

  return (
    <>
      {/* Navbar */}
      <div
        className={cn(
          hasOwnMobileHeader && "hidden md:block",
          showModal && "pointer-events-none relative"
        )}
      >
        <Navbar />
        {showModal && <div className="absolute inset-0 z-40 bg-neutral-950/80" />}
      </div>
      <div className="relative pb-22 md:pb-26">
        {showModal ? pinnedChildren : children}
        {modal}
      </div>
      <div className={showModal ? "pointer-events-none relative" : undefined}>
        <MobileBottomNav />
        {showModal && <div className="absolute inset-0 z-40 bg-neutral-950/80" />}
      </div>
    </>
  );
}
