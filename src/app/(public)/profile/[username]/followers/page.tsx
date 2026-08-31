import { FollowListPage } from "@/components/user/FollowListPage";

interface UserFollowersPageProps {
  params: Promise<{ username: string }>;
}

export default async function UserFollowersPage({ params }: UserFollowersPageProps) {
  const { username } = await params;
  return <FollowListPage type="followers" username={username} basePath={`/profile/${username}`} />;
}
