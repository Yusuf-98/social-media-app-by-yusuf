"use client";

import Link from "next/link";
import { IntentLink } from "@/components/common/IntentLink";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { CloseIcon, LogoIcon, MenuHamburgerIcon, SearchWhiteIcon } from "@/components/icons";
import { SearchDropdown } from "@/components/layout/SearchDropdown";
import { useAuth } from "@/hooks/auth/useAuth";
import { useIsClient } from "@/hooks/common/useIsClient";
import { useLogout } from "@/hooks/auth/useLogout";

const ProfileMenu = dynamic(
  () => import("@/components/layout/ProfileMenu").then((m) => m.ProfileMenu),
  {
    ssr: false,
  }
);

export function Navbar() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const handleLogout = useLogout();
  const [isAuthMenuOpen, setIsAuthMenuOpen] = useState(false);
  const mounted = useIsClient();

  return (
    <header className="relative w-full">
      <div className="bg-base-black sticky top-0 z-40 w-full border-b border-neutral-900">
        <div className="custom-container h-7xl md:h-8xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/feed"
            prefetch={false}
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
            <ProfileMenu user={user} onLogout={handleLogout} />
          ) : (
            <>
              {/* Right group - mobile */}
              <div className="gap-xl flex shrink-0 items-center md:hidden">
                <IntentLink href="/users/search" aria-label="Search">
                  <SearchWhiteIcon className="size-5" />
                </IntentLink>
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
                  render={<IntentLink href="/login" />}
                  className="h-11! w-32.5!"
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  render={<IntentLink href="/register" />}
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
            <Button
              variant="secondary"
              render={<IntentLink href="/login" />}
              className="h-10! flex-1"
            >
              Login
            </Button>
            <Button
              variant="primary"
              render={<IntentLink href="/register" />}
              className="h-10! flex-1"
            >
              Register
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
