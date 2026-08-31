import { MyProfilePageShell } from "@/components/profile/MyProfilePageShell";
import { MySavedGrid } from "@/components/profile/MySavedGrid";

export default function MySavedPage() {
  return (
    <MyProfilePageShell activeTab="saved">
      <MySavedGrid />
    </MyProfilePageShell>
  );
}
