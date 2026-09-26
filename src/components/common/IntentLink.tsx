"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type IntentLinkProps = Omit<React.ComponentProps<typeof Link>, "href" | "prefetch"> & {
  href: string;
};

export function IntentLink({
  href,
  onMouseEnter,
  onFocus,
  onTouchStart,
  ...props
}: IntentLinkProps) {
  const router = useRouter();

  return (
    <Link
      href={href}
      prefetch={false}
      onMouseEnter={(e) => {
        router.prefetch(href);
        onMouseEnter?.(e);
      }}
      onFocus={(e) => {
        router.prefetch(href);
        onFocus?.(e);
      }}
      onTouchStart={(e) => {
        router.prefetch(href);
        onTouchStart?.(e);
      }}
      {...props}
    />
  );
}
