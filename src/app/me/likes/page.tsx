import type { Metadata } from "next";
import { MyProfilePageShell } from "@/components/profile/MyProfilePageShell";
import { MyLikesGrid } from "@/components/profile/MyLikesGrid";

export const metadata: Metadata = {
  title: "My Likes — Sociality",
};

export default function MyLikesPage() {
  return (
    <MyProfilePageShell activeTab="likes">
      <MyLikesGrid />
    </MyProfilePageShell>
  );
}
