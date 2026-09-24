import { FeedShell } from "@/components/post/FeedShell";
import { FeedSkeleton } from "@/components/post/PostCardSkeleton";

export default function Loading() {
  return (
    <FeedShell>
      <FeedSkeleton />
    </FeedShell>
  );
}
