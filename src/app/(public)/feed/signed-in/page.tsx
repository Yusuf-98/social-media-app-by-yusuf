import type { Metadata } from "next";
import { FeedContent } from "@/components/post/FeedContent";

export const metadata: Metadata = {
  title: "Feed — Sociality",
  robots: { index: false },
};

export default function SignedInFeedPage() {
  return <FeedContent />;
}
