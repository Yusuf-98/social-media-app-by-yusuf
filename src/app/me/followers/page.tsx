import { FollowListPage } from "@/components/user/FollowListPage";

export default function MyFollowersPage() {
  return <FollowListPage type="followers" basePath="/me" />;
}
