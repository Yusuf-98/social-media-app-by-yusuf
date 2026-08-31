import { describe, expect, it } from "vitest";
import { patchPost } from "@/lib/postCache";
import type { Post } from "@/types/api";

function makePost(overrides: Partial<Post> = {}): Post {
  return {
    id: 1,
    imageUrl: "https://example.com/a.jpg",
    caption: "hello",
    createdAt: new Date().toISOString(),
    author: { id: 1, username: "a", name: "A", avatarUrl: null },
    likeCount: 0,
    commentCount: 0,
    likedByMe: false,
    ...overrides,
  };
}

describe("patchPost", () => {
  it("patches the matching post inside a posts list", () => {
    const data = { posts: [makePost({ id: 1 }), makePost({ id: 2 })] };
    const result = patchPost(data, 1, { likeCount: 3, likedByMe: true });
    expect(result.posts[0]).toMatchObject({ likeCount: 3, likedByMe: true });
    expect(result.posts[1]).toMatchObject({ likeCount: 0, likedByMe: false });
  });

  it("leaves unrelated cache shapes untouched", () => {
    const data = { users: [{ id: 1, username: "a" }] };
    const result = patchPost(data, 1, { likeCount: 3 });
    expect(result).toEqual(data);
  });
});
