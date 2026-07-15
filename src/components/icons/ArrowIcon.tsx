import type { IconProps } from "./types";

export function ArrowIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className ?? "size-6"}>
      <path
        d="M6.66667 16H25.3333M16 25.3333L25.3333 16L16 6.66667"
        stroke="#FDFDFD"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
