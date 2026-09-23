import Link from "next/link";
import { PostImage } from "@/components/post/PostImage";
import type { Post } from "@/types/api";

interface PostGridProps {
  posts: Post[];
}

export function PostGrid({ posts }: PostGridProps) {
  return (
    <div className="gap-xxs md:gap-xs grid w-full grid-cols-3">
      {posts.map((post, index) => (
        <Link
          key={post.id}
          href={`/posts/${post.id}`}
          className="rounded-xs md:rounded-sm relative aspect-square w-full overflow-hidden bg-neutral-200"
        >
          <PostImage
            post={post}
            sizes="(min-width: 768px) 33vw, 33vw"
            className="object-contain"
            loading={index === 0 ? "eager" : "lazy"}
          />
        </Link>
      ))}
    </div>
  );
}
