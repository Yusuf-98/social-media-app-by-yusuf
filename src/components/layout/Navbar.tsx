"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { MenuRoot } from "@base-ui/react/menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CloseIcon, LogoIcon, MenuHamburgerIcon, SearchWhiteIcon } from "@/components/icons";
import { SearchDropdown } from "@/components/layout/SearchDropdown";
import { useAuth } from "@/hooks/auth/useAuth";
import { useIsClient } from "@/hooks/common/useIsClient";
import { useLogout } from "@/hooks/auth/useLogout";

export function Navbar() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const handleLogout = useLogout();
  const [isAuthMenuOpen, setIsAuthMenuOpen] = useState(false);
  const mobileProfileMenuActionsRef = useRef<MenuRoot.Actions>(null);
  const desktopProfileMenuActionsRef = useRef<MenuRoot.Actions>(null);
  const mounted = useIsClient();

  // Close menu on breakpoint cross
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        mobileProfileMenuActionsRef.current?.close();
      } else {
        desktopProfileMenuActionsRef.current?.close();
      }
    };
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return (
    <header className="relative w-full">
      <div className="bg-base-black sticky top-0 z-40 w-full border-b border-neutral-900">
        <div className="custom-container h-7xl md:h-8xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/feed"
            onClick={(e) => {
              // Hard navigation
              e.preventDefault();
              window.location.href = "/feed";
            }}
            className="flex shrink-0 items-center gap-2.75"
          >
            <LogoIcon className="size-7.5" />
            <p className="font-display text-display-xs text-neutral-25 font-bold whitespace-nowrap">
              Sociality
            </p>
          </Link>

          {/* Search - desktop */}
          <SearchDropdown />

          {!mounted || isLoading ? null : isAuthenticated ? (
            <>
              {/* Right group - mobile */}
              <div className="gap-xl flex shrink-0 items-center md:hidden">
                <Link href="/users/search" aria-label="Search">
                  <SearchWhiteIcon className="size-5" />
                </Link>
                <DropdownMenu actionsRef={mobileProfileMenuActionsRef}>
                  <DropdownMenuTrigger aria-label="Profile menu">
                    <Avatar className="size-10!">
                      <AvatarImage src={user?.avatarUrl ?? undefined} alt={user?.name ?? ""} />
                      <AvatarFallback>{user?.name?.[0]?.toUpperCase() ?? "?"}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {/* User info */}
                    <div className="gap-3xs px-lg py-md flex flex-col">
                      <p className="tracking-t-2 text-neutral-25 text-sm font-bold">{user?.name}</p>
                      <p className="tracking-t-2 text-sm text-neutral-400">{user?.username}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem render={<Link href="/me" prefetch={false} />}>
                      My Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Profile - desktop */}
              <DropdownMenu actionsRef={desktopProfileMenuActionsRef}>
                <DropdownMenuTrigger
                  aria-label="Profile menu"
                  className="hidden shrink-0 items-center gap-3.25 md:flex"
                >
                  <Avatar className="size-6xl!">
                    <AvatarImage src={user?.avatarUrl ?? undefined} alt={user?.name ?? ""} />
                    <AvatarFallback>{user?.name?.[0]?.toUpperCase() ?? "?"}</AvatarFallback>
                  </Avatar>
                  <span className="text-md tracking-t-2 text-neutral-25 font-bold whitespace-nowrap">
                    {user?.name}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {/* User info */}
                  <div className="gap-3xs px-lg py-md flex flex-col">
                    <p className="tracking-t-2 text-neutral-25 text-sm font-bold">{user?.name}</p>
                    <p className="tracking-t-2 text-sm text-neutral-400">{user?.username}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem render={<Link href="/me" prefetch={false} />}>
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {/* Right group - mobile */}
              <div className="gap-xl flex shrink-0 items-center md:hidden">
                <Link href="/users/search" aria-label="Search">
                  <SearchWhiteIcon className="size-5" />
                </Link>
                <button
                  type="button"
                  onClick={() => setIsAuthMenuOpen((v) => !v)}
                  aria-label="Menu"
                  aria-expanded={isAuthMenuOpen}
                >
                  {isAuthMenuOpen ? (
                    <CloseIcon className="size-6" />
                  ) : (
                    <MenuHamburgerIcon className="size-6" />
                  )}
                </button>
              </div>

              {/* Login/Register - desktop */}
              <div className="gap-lg hidden shrink-0 items-center md:flex">
                <Button
                  variant="secondary"
                  render={<Link href="/login" />}
                  className="h-11! w-32.5!"
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  render={<Link href="/register" />}
                  className="h-11! w-32.5!"
                >
                  Register
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Auth buttons row - mobile */}
      {mounted && !isLoading && !isAuthenticated && isAuthMenuOpen && (
        <div className="bg-base-black absolute inset-x-0 top-full z-30 border-b border-neutral-900 md:hidden">
          <div className="custom-container gap-lg pb-xl mx-auto flex items-center">
            <Button variant="secondary" render={<Link href="/login" />} className="h-10! flex-1">
              Login
            </Button>
            <Button variant="primary" render={<Link href="/register" />} className="h-10! flex-1">
              Register
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
