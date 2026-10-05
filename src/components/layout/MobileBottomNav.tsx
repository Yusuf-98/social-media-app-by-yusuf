"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AddIcon,
  HomeActiveIcon,
  HomeIcon,
  ProfileFilledActiveIcon,
  ProfileFilledIcon,
} from "@/components/icons";
import { useAuth } from "@/hooks/auth/useAuth";
import { useHideOnScroll } from "@/hooks/common/useHideOnScroll";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const visible = useHideOnScroll();

  function hardNavigate(e: React.MouseEvent, href: string) {
    // Hard navigation
    e.preventDefault();
    window.location.href = isAuthenticated ? href : `/login?returnTo=${encodeURIComponent(href)}`;
  }
  const isHome = pathname === "/feed";
  const isProfile = pathname.startsWith("/me");

  return (
    <nav
      className={cn(
        "my-3xl h-7xl md:h-8xl fixed inset-x-0 bottom-0 z-40 mx-auto flex w-86.25 items-center justify-center gap-11.25 rounded-full border border-neutral-900 bg-neutral-950 backdrop-blur-[50px] transition-opacity duration-300 md:w-90",
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <Link
        href="/feed"
        prefetch={false}
        onClick={(e) => hardNavigate(e, "/feed")}
        className="gap-xxs md:gap-xs flex w-23.5 flex-col items-center justify-center"
      >
        {isHome ? (
          <HomeActiveIcon className="size-5 md:size-6" />
        ) : (
          <HomeIcon className="size-5 md:size-6" />
        )}
        <p
          className={cn(
            "text-neutral-25 md:text-md text-xs",
            isHome && "text-primary-150 font-bold"
          )}
        >
          Home
        </p>
      </Link>

      <Link
        href="/posts/create"
        prefetch={false}
        aria-label="Create post"
        className="bg-primary-300 md:p-md flex size-11 shrink-0 items-center justify-center rounded-full p-[7.333px] md:size-12"
      >
        <AddIcon className="size-5.5 md:size-6" />
      </Link>

      <Link
        href="/me"
        prefetch={false}
        onClick={(e) => hardNavigate(e, "/me")}
        className="gap-xxs md:gap-xs flex w-23.5 flex-col items-center justify-center"
      >
        {isProfile ? (
          <ProfileFilledActiveIcon className="size-5 md:size-6" />
        ) : (
          <ProfileFilledIcon className="size-5 md:size-6" />
        )}
        <p
          className={cn(
            "text-neutral-25 md:text-md text-xs",
            isProfile && "text-primary-150 font-bold"
          )}
        >
          Profile
        </p>
      </Link>
    </nav>
  );
}
