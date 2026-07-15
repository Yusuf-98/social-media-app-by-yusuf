import Image from "next/image";
import { ProfileFilledIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  src?: string | null;
  alt: string;
  className?: string;
}

export function UserAvatar({ src, alt, className }: UserAvatarProps) {
  if (src) {
    return (
      <div className={cn("relative shrink-0 overflow-hidden rounded-full", className)}>
        <Image src={src} alt={alt} fill sizes="128px" className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-neutral-800",
        className
      )}
    >
      <ProfileFilledIcon className="size-3/5" />
    </div>
  );
}
