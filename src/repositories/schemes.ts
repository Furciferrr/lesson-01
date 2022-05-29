import {
  Blogger,
  CommentDBType,
  Post,
  UserDBType,
  VideoType,
} from "../types";
import mongoose from "mongoose";

export const BloggerScheme = new mongoose.Schema<Blogger>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  youtubeUrl: { type: String, required: true },
});

export const PostScheme = new mongoose.Schema<Post>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  content: { type: String, required: true },
  bloggerId: { type: String, required: true },
  bloggerName: { type: String, required: true },
});

export const VideoScheme = new mongoose.Schema<VideoType>({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
});

export const UserScheme = new mongoose.Schema<UserDBType>({
  id: { type: String, required: true },
  login: { type: String, required: true },
  hashPassword: { type: String, required: true },
});

export const CommentScheme = new mongoose.Schema<CommentDBType>({
  id: { type: String, required: true },
  content: { type: String, required: true },
  userId: { type: String, required: true },
  userLogin: { type: String, required: true },
  addedAt: { type: String, required: true },
  postId: { type: String, required: true },
});
