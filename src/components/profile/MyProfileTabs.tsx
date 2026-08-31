"use client";

import Link from "next/link";
import { Settings } from "lucide-react";
import { GridIcon, HeartOutlineIcon } from "@/components/icons";
import { BookmarkIcon } from "@/components/icons/BookmarkIcon";
import { cn } from "@/lib/utils";

type Tab = "gallery" | "saved" | "likes" | "settings";

interface MyProfileTabsProps {
  active: Tab;
}

/** Tab item */
function TabLink({
  href,
  active,
  icon,
  label,
}: {
  href: string;
  active: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "h-6xl gap-md md:gap-lg px-2xl flex flex-1 items-center justify-center border-b",
        active ? "border-neutral-25 border-b-2" : "border-neutral-900"
      )}
    >
      {icon}
      <p
        className={cn(
          "text-neutral-25 md:text-md text-sm font-bold",
          active ? "tracking-t-1 md:tracking-t-2" : "font-medium tracking-normal text-neutral-400"
        )}
      >
        {label}
      </p>
    </Link>
  );
}

export function MyProfileTabs({ active }: MyProfileTabsProps) {
  return (
    <div className="flex w-full items-center">
      <TabLink
        href="/me"
        active={active === "gallery"}
        icon={<GridIcon className={cn("size-5 md:size-6", active !== "gallery" && "opacity-50")} />}
        label="Gallery"
      />
      <TabLink
        href="/me/saved"
        active={active === "saved"}
        icon={
          <BookmarkIcon
            className={cn("text-neutral-25 size-5 md:size-6", active !== "saved" && "opacity-50")}
          />
        }
        label="Saved"
      />
      <TabLink
        href="/me/likes"
        active={active === "likes"}
        icon={
          <HeartOutlineIcon className={cn("size-5 md:size-6", active !== "likes" && "opacity-50")} />
        }
        label="Likes"
      />
      <TabLink
        href="/me?tab=settings"
        active={active === "settings"}
        icon={
          <Settings
            className={cn("text-neutral-25 size-5 md:size-6", active !== "settings" && "opacity-50")}
          />
        }
        label="Settings"
      />
    </div>
  );
}
