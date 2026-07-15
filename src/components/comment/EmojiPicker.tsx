"use client";

import { useState } from "react";
import { EmojiIcon } from "@/components/icons";

const EMOJIS = [
  "😀",
  "😂",
  "😍",
  "😎",
  "😢",
  "😡",
  "👍",
  "👏",
  "🙏",
  "🔥",
  "🎉",
  "❤️",
  "😮",
  "😅",
  "🤔",
  "💯",
  "🥰",
  "😇",
  "🙂",
  "😋",
  "🤪",
  "🤐",
  "😏",
  "🤗",
  "😪",
  "🙄",
  "🤫",
  "😴",
  "🥵",
  "😫",
  "😭",
  "😱",
];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

export function EmojiPicker({ onSelect }: EmojiPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open emoji picker"
        aria-expanded={open}
        className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-neutral-900"
      >
        <EmojiIcon className="size-6" />
      </button>
      {open && (
        <>
          <button
            type="button"
            aria-label="Close emoji picker"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className="mb-sm gap-xs p-md absolute bottom-full left-0 z-50 grid w-52.5 grid-cols-4 rounded-xl border border-neutral-900 bg-neutral-900">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  onSelect(emoji);
                  setOpen(false);
                }}
                className="flex size-10 items-center justify-center rounded-md text-xl hover:bg-neutral-800"
              >
                {emoji}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
