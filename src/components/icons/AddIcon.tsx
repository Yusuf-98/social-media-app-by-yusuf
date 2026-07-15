import type { IconProps } from "./types";

export function AddIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 22 22" fill="none" className={className ?? "size-6"}>
      <path
        d="M11 4.58333V17.4167M4.58333 11H17.4167"
        stroke="#FDFDFD"
        strokeWidth="1.83333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
