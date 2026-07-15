import type { IconProps } from "./types";

export function MenuHamburgerIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? "size-6"}>
      <path
        d="M3 12H21M3 6H21M3 18H21"
        stroke="#FDFDFD"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
