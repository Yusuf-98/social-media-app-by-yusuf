import type { Metadata } from "next";
import { FeedContent } from "@/components/post/FeedContent";

export const metadata: Metadata = {
  title: "Feed — Sociality",
};

export default function FeedPage() {
  return <FeedContent />;
}
