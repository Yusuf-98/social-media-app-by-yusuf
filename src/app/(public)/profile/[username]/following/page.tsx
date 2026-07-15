"use client";

import { useParams } from "next/navigation";
import { FollowListPage } from "@/components/user/FollowListPage";

export default function UserFollowingPage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  return <FollowListPage type="following" username={username} basePath={`/profile/${username}`} />;
}
