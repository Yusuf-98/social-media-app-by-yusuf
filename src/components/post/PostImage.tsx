"use client";

import Image from "next/image";
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

  if (error) return null;

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
