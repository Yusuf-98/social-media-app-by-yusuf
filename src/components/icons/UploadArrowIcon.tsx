import type { IconProps } from "./types";

export function UploadArrowIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className ?? "size-6"}>
      <path
        d="M17.5 2.5H2.5M5 10.8333L10 5.83333L15 10.8333M10 5.83333V17.5"
        stroke="#FDFDFD"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
