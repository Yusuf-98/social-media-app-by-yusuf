import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";
import { applyLikeSaveCrossCheck, applyLikeSaveCrossCheckList } from "@/lib/likeSaveCrossCheck";
import { qk } from "@/lib/queryKeys";
import type { Post } from "@/types/api";

function makePost(overrides: Partial<Post> = {}): Post {
  return {
    id: 1,
    imageUrl: "https://example.com/a.jpg",
    caption: null,
    createdAt: new Date().toISOString(),
    author: { id: 1, username: "a", name: "A", avatarUrl: null },
    likeCount: 0,
    commentCount: 0,
    likedByMe: false,
    savedByMe: false,
    ...overrides,
  };
}

describe("likeSaveCrossCheck", () => {
  it("overrides likedByMe/savedByMe when the post id is in the cached id lists", () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(qk.me.likedIds(), [1]);
    queryClient.setQueryData(qk.me.savedIds(), []);

    const result = applyLikeSaveCrossCheck(queryClient, makePost({ id: 1 }));
    expect(result.likedByMe).toBe(true);
    expect(result.savedByMe).toBe(false);
  });

  it("leaves the post's own flags alone when no cached id lists exist", () => {
    const queryClient = new QueryClient();
    const result = applyLikeSaveCrossCheck(queryClient, makePost({ likedByMe: true }));
    expect(result.likedByMe).toBe(true);
  });

  it("applies the cross-check across a list of posts", () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(qk.me.savedIds(), [2]);

    const result = applyLikeSaveCrossCheckList(queryClient, [
      makePost({ id: 1 }),
      makePost({ id: 2 }),
    ]);
    expect(result[0].savedByMe).toBe(false);
    expect(result[1].savedByMe).toBe(true);
  });
});
