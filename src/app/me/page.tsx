import { MyProfilePageShell } from "@/components/profile/MyProfilePageShell";
import { MyPostsGrid } from "@/components/profile/MyPostsGrid";
import { MySettingsSection } from "@/components/profile/MySettingsSection";

interface MyProfilePageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function MyProfilePage({ searchParams }: MyProfilePageProps) {
  const { tab } = await searchParams;
  const isSettings = tab === "settings";

  return (
    <MyProfilePageShell activeTab={isSettings ? "settings" : "gallery"}>
      {isSettings ? <MySettingsSection /> : <MyPostsGrid />}
    </MyProfilePageShell>
  );
}
