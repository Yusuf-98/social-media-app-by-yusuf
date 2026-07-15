"use client";

import { useParams } from "next/navigation";
import { PostDetailContent } from "@/components/post/PostDetailContent";

export default function PostDetailPage() {
  const params = useParams<{ id: string }>();
  const postId = Number(params.id);

  return (
    <div className="custom-container py-3xl mx-auto">
      <PostDetailContent postId={postId} />
    </div>
  );
}
