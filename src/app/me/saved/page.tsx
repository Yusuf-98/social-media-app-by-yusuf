import type { Metadata } from "next";
import { MyProfilePageShell } from "@/components/profile/MyProfilePageShell";
import { MySavedGrid } from "@/components/profile/MySavedGrid";

export const metadata: Metadata = {
  title: "My Saved — Sociality",
};

export default function MySavedPage() {
  return (
    <MyProfilePageShell activeTab="saved">
      <MySavedGrid />
    </MyProfilePageShell>
  );
}
