import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api/comments", () => ({
  addComment: vi.fn(),
  deleteComment: vi.fn(),
  getComments: vi.fn(),
}));

vi.mock("@/hooks/auth/useAuth", () => ({
  useAuth: () => ({
    user: { id: 1, username: "me", name: "Me", avatarUrl: null },
    isAuthenticated: true,
    hasHydrated: true,
    isLoading: false,
  }),
}));

import { addComment, deleteComment } from "@/lib/api/comments";
import { useAddComment, useDeleteComment } from "@/hooks/comment/useComments";
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
    commentCount: 2,
    likedByMe: false,
    ...overrides,
  };
}

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe("useAddComment", () => {
  beforeEach(() => {
    vi.mocked(addComment).mockReset();
  });

  it("optimistically inserts the comment and bumps commentCount", async () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(qk.post(1), makePost({ commentCount: 2 }));
    vi.mocked(addComment).mockResolvedValue(undefined as never);

    const { result } = renderHook(() => useAddComment(1), { wrapper: createWrapper(queryClient) });

    result.current.mutate("nice post");

    await waitFor(() => {
      const comments = queryClient.getQueryData<{ pages: { comments: unknown[] }[] }>(
        qk.comments(1)
      );
      expect(comments?.pages[0].comments).toHaveLength(1);
    });
    expect(queryClient.getQueryData<Post>(qk.post(1))?.commentCount).toBe(3);
  });

  it("rolls back the comment and the count when the mutation fails", async () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(qk.post(1), makePost({ commentCount: 2 }));
    vi.mocked(addComment).mockRejectedValue(new Error("network error"));

    const { result } = renderHook(() => useAddComment(1), { wrapper: createWrapper(queryClient) });

    result.current.mutate("nice post");

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(queryClient.getQueryData<Post>(qk.post(1))?.commentCount).toBe(2);
    const comments = queryClient.getQueryData<{ pages: { comments: unknown[] }[] } | undefined>(
      qk.comments(1)
    );
    expect(comments).toBeUndefined();
  });
});

describe("useDeleteComment", () => {
  beforeEach(() => {
    vi.mocked(deleteComment).mockReset();
  });

  it("optimistically removes the comment and decrements commentCount, never below zero", async () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(qk.post(1), makePost({ commentCount: 0 }));
    queryClient.setQueryData(qk.comments(1), {
      pages: [{ comments: [{ id: 10, text: "x" }], pagination: { page: 1, limit: 20, total: 1, totalPages: 1 } }],
      pageParams: [1],
    });
    vi.mocked(deleteComment).mockResolvedValue(undefined as never);

    const { result } = renderHook(() => useDeleteComment(1), { wrapper: createWrapper(queryClient) });

    result.current.mutate(10);

    await waitFor(() => {
      const comments = queryClient.getQueryData<{ pages: { comments: unknown[] }[] }>(
        qk.comments(1)
      );
      expect(comments?.pages[0].comments).toHaveLength(0);
    });
    expect(queryClient.getQueryData<Post>(qk.post(1))?.commentCount).toBe(0);
  });
});
