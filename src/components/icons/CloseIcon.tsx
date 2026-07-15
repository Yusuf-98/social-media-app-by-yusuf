import type { IconProps } from "./types";

export function CloseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? "size-6"}>
      <path
        d="M18 6L6 18M6 6L18 18"
        stroke="#FDFDFD"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
