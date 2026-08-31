"use client";

import Image from "next/image";
import { ImageOff } from "lucide-react";
import { useState } from "react";
import type { Post } from "@/types/api";

interface PostImageProps {
  post: Pick<Post, "imageUrl" | "caption" | "author">;
  sizes: string;
  className?: string;
  loading?: "eager" | "lazy";
}

export function PostImage({ post, sizes, className, loading = "lazy" }: PostImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="gap-sm absolute inset-0 flex flex-col items-center justify-center bg-neutral-900">
        <ImageOff className="size-8 text-neutral-600" />
        <p className="text-sm text-neutral-600">Image unavailable</p>
      </div>
    );
  }

  return (
    <Image
      src={post.imageUrl}
      alt={post.caption || `Post by ${post.author.name}`}
      fill
      sizes={sizes}
      className={className}
      loading={loading}
      onError={() => setError(true)}
    />
  );
}
