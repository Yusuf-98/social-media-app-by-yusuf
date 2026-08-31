"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followUser, unfollowUser } from "@/lib/api/follow";
import { trackEvent } from "@/lib/analytics";
import { patchUserFollow } from "@/lib/userCache";
import { invalidateUserProfile, isPostOrUserQuery } from "@/lib/queryKeys";

interface FollowTarget {
  username: string;
  isFollowing: boolean;
}

export function useFollowToggle(target: FollowTarget) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      trackEvent(target.isFollowing ? "unfollow" : "follow", { username: target.username });
      return target.isFollowing ? unfollowUser(target.username) : followUser(target.username);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ predicate: isPostOrUserQuery });
      const previous = queryClient.getQueriesData({ predicate: isPostOrUserQuery });
      const nextFollowing = !target.isFollowing;
      queryClient.setQueriesData({ predicate: isPostOrUserQuery }, (old: unknown) =>
        patchUserFollow(old, target.username, nextFollowing)
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      context?.previous.forEach(([key, data]) => queryClient.setQueryData(key, data));
    },
    onSettled: () => {
      invalidateUserProfile(queryClient, target.username);
    },
  });
}
