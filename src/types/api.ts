export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UserSummary {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
  isFollowedByMe: boolean;
  isMe?: boolean;
  followsMe?: boolean;
}

export interface PublicProfile {
  id: number;
  name: string;
  username: string;
  bio: string | null;
  avatarUrl: string | null;
  email: string;
  phone: string | null;
  counts: {
    post: number;
    followers: number;
    following: number;
    likes: number;
  };
  isFollowing: boolean;
  isMe: boolean;
}

export interface PostAuthor {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
}

export interface Post {
  id: number;
  imageUrl: string;
  caption: string | null;
  createdAt: string;
  author: PostAuthor;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
  savedByMe?: boolean;
}

export interface Comment {
  id: number;
  text: string;
  createdAt: string;
  author: PostAuthor;
}

export interface AuthUser {
  id: number;
  name: string;
  username: string;
  email: string;
  avatarUrl: string | null;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface MyProfile {
  id: number;
  name: string;
  username: string;
  bio: string | null;
  avatarUrl: string | null;
  email: string;
  phone: string | null;
  counts: {
    post: number;
    followers: number;
    following: number;
    likes: number;
  };
}
