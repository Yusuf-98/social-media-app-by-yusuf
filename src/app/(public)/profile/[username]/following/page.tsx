import { FollowListPage } from "@/components/user/FollowListPage";

interface UserFollowingPageProps {
  params: Promise<{ username: string }>;
}

export default async function UserFollowingPage({ params }: UserFollowingPageProps) {
  const { username } = await params;
  return <FollowListPage type="following" username={username} basePath={`/profile/${username}`} />;
}
