import type { Metadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { PostDetailContent } from "@/components/post/PostDetailContent";
import { getPost } from "@/lib/api/posts";
import { qk } from "@/lib/queryKeys";

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PostDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const post = await getPost(Number(id));
    return {
      title: `${post.author.name} on Sociality`,
      description: post.caption || `A post by ${post.author.name} on Sociality`,
    };
  } catch {
    return { title: "Post — Sociality" };
  }
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params;
  const postId = Number(id);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: qk.post(postId),
    queryFn: () => getPost(postId),
  });

  return (
    <div className="custom-container py-3xl mx-auto">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PostDetailContent postId={postId} />
      </HydrationBoundary>
    </div>
  );
}
