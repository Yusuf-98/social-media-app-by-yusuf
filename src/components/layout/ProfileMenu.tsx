"use client";

import Link from "next/link";
import { IntentLink } from "@/components/common/IntentLink";
import { useEffect, useRef } from "react";
import type { MenuRoot } from "@base-ui/react/menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchWhiteIcon } from "@/components/icons";
import type { MyProfile } from "@/types/api";

interface ProfileMenuProps {
  user: Pick<MyProfile, "name" | "username" | "avatarUrl"> | null;
  onLogout: () => void;
}

export function ProfileMenu({ user, onLogout }: ProfileMenuProps) {
  const mobileProfileMenuActionsRef = useRef<MenuRoot.Actions>(null);
  const desktopProfileMenuActionsRef = useRef<MenuRoot.Actions>(null);

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
    <>
      {/* Right group - mobile */}
      <div className="gap-xl flex shrink-0 items-center md:hidden">
        <IntentLink href="/users/search" aria-label="Search">
          <SearchWhiteIcon className="size-5" />
        </IntentLink>
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
            <DropdownMenuItem variant="destructive" onClick={onLogout}>
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
          <DropdownMenuItem variant="destructive" onClick={onLogout}>
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
