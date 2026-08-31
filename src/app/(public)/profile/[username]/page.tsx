import type { Metadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { ProfileContent } from "@/components/profile/ProfileContent";
import { getPublicProfile } from "@/lib/api/users";
import { qk } from "@/lib/queryKeys";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  try {
    const profile = await getPublicProfile(username);
    return {
      title: `${profile.name} (@${profile.username}) — Sociality`,
      description: profile.bio || `${profile.name}'s profile on Sociality`,
    };
  } catch {
    return { title: "Profile — Sociality" };
  }
}

export default async function PublicProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: qk.users.profile(username),
    queryFn: () => getPublicProfile(username),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileContent username={username} />
    </HydrationBoundary>
  );
}
