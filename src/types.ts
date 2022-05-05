import { WithId } from "mongodb";

export interface Blogger {
  id: number;
  name: string;
  youtubeUrl: string;
}

export interface Post {
  id: number;
  title: string;
  shortDescription: string;
  content: string;
  bloggerId: number;
  bloggerName: string;
}

export interface VideoType {
  id: number;
  title: string;
  author: string;
}

enum Errors {
  noContent = 204,
  notFound = 404,
  badRequest = 400,
}

export interface BloggerBodyType {
  name: string;
  youtubeUrl: string;
}

export interface ErrorType {
  errorsMessages: {
    message: string;
    field: string;
  }[];
  resultCode: 0 | 1 | 2;
}

export interface PaginationType {
  pageNumber?: number;
  pageSize?: number;
}

export interface UserViewType extends Omit<UserDBType, "hashPassword"> {}

export interface UserDBType {
  id: number;
  login: string;
  hashPassword: string;
}

export interface ResponseType<T> {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Array<T>;
}

export interface CommentDBType {
  id: number;
  content: string;
  userId: string;
  userLogin: string;
  addedAt: string;
  postId: number;
}

export type DBType<T> = {
  items: T[];
  pagination: [{ totalCount: number }];
};

export type CommentResponse = Omit<CommentDBType, "postId">;
