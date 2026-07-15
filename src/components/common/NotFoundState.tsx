"use client";

import { useRouter } from "next/navigation";
import { ArrowIcon } from "@/components/icons";

interface NotFoundStateProps {
  title: string;
  description?: string;
}

export function NotFoundState({ title, description }: NotFoundStateProps) {
  const router = useRouter();

  return (
    <div className="gap-lg py-11xl flex flex-col items-center justify-center text-center">
      <button type="button" onClick={() => router.back()} aria-label="Back">
        <ArrowIcon className="size-6 rotate-180" />
      </button>
      <p className="text-neutral-25 text-lg font-bold">{title}</p>
      {description && <p className="text-md text-neutral-400">{description}</p>}
    </div>
  );
}
