import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api/likes", () => ({
  likePost: vi.fn(),
  unlikePost: vi.fn(),
}));

import { likePost, unlikePost } from "@/lib/api/likes";
import { useLikeToggle } from "@/hooks/post/useLikeToggle";
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
    ...overrides,
  };
}

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe("useLikeToggle", () => {
  beforeEach(() => {
    vi.mocked(likePost).mockReset();
    vi.mocked(unlikePost).mockReset();
  });

  it("optimistically flips likedByMe and increments likeCount", async () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(qk.post(1), makePost({ likeCount: 2, likedByMe: false }));
    vi.mocked(likePost).mockResolvedValue(undefined as never);

    const { result } = renderHook(() => useLikeToggle(makePost({ likeCount: 2, likedByMe: false })), {
      wrapper: createWrapper(queryClient),
    });

    result.current.mutate();

    await waitFor(() => {
      expect(queryClient.getQueryData<Post>(qk.post(1))).toMatchObject({
        likedByMe: true,
        likeCount: 3,
      });
    });
  });

  it("rolls back the optimistic update when the mutation fails", async () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(qk.post(1), makePost({ likeCount: 2, likedByMe: false }));
    vi.mocked(likePost).mockRejectedValue(new Error("network error"));

    const { result } = renderHook(() => useLikeToggle(makePost({ likeCount: 2, likedByMe: false })), {
      wrapper: createWrapper(queryClient),
    });

    result.current.mutate();

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(queryClient.getQueryData<Post>(qk.post(1))).toMatchObject({
      likedByMe: false,
      likeCount: 2,
    });
  });

  it("never lets likeCount go negative when unliking from zero", async () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(qk.post(1), makePost({ likeCount: 0, likedByMe: true }));
    vi.mocked(unlikePost).mockResolvedValue(undefined as never);

    const { result } = renderHook(() => useLikeToggle(makePost({ likeCount: 0, likedByMe: true })), {
      wrapper: createWrapper(queryClient),
    });

    result.current.mutate();

    await waitFor(() => {
      expect(queryClient.getQueryData<Post>(qk.post(1))).toMatchObject({
        likedByMe: false,
        likeCount: 0,
      });
    });
  });
});
