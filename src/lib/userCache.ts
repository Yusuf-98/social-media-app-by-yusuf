import { patchEntityInCache } from "@/lib/queryCache";

interface FollowableUser {
  username: string;
  isFollowing?: boolean;
  isFollowedByMe?: boolean;
}

function isFollowableUser(value: unknown): value is FollowableUser {
  return !!value && typeof value === "object" && "username" in value;
}

export function patchUserFollow<T>(data: T, username: string, isFollowedByMe: boolean): T {
  return patchEntityInCache<FollowableUser, T>(data, {
    arrayKey: "users",
    isItem: isFollowableUser,
    matches: (u) => u.username === username,
    patch: (u) => ({
      ...u,
      ...("isFollowing" in u ? { isFollowing: isFollowedByMe } : {}),
      ...("isFollowedByMe" in u ? { isFollowedByMe } : {}),
    }),
  });
}
