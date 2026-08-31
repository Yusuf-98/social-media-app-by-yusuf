import { MyProfilePageShell } from "@/components/profile/MyProfilePageShell";
import { MyLikesGrid } from "@/components/profile/MyLikesGrid";

export default function MyLikesPage() {
  return (
    <MyProfilePageShell activeTab="likes">
      <MyLikesGrid />
    </MyProfilePageShell>
  );
}
