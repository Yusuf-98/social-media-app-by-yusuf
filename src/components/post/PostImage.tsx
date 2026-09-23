"use client";

import Image from "next/image";
import { ImageOff } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Post } from "@/types/api";

interface PostImageProps {
  post: Pick<Post, "imageUrl" | "caption" | "author">;
  sizes: string;
  className?: string;
  loading?: "eager" | "lazy";
  natural?: boolean;
}

export function PostImage({ post, sizes, className, loading = "lazy", natural = false }: PostImageProps) {
  const [error, setError] = useState(false);
  const alt = post.caption || `Post by ${post.author.name}`;

  if (error) {
    return (
      <div
        className={cn(
          "gap-sm flex flex-col items-center justify-center bg-neutral-900",
          natural ? "aspect-square w-full" : "absolute inset-0"
        )}
      >
        <ImageOff className="size-8 text-neutral-600" />
        <p className="text-sm text-neutral-600">Image unavailable</p>
      </div>
    );
  }

  if (natural) {
    return (
      <Image
        src={post.imageUrl}
        alt={alt}
        width={1080}
        height={1080}
        sizes={sizes}
        className={cn("h-auto w-full", className)}
        loading={loading}
        onError={() => setError(true)}
      />
    );
  }

  return (
    <Image
      src={post.imageUrl}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      loading={loading}
      onError={() => setError(true)}
    />
  );
}
