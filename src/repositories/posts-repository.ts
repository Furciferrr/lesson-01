import { PostDto, UpdatePostDto } from "../dto";
import { Post } from "../types";
import { getRandomNumber } from "../utils";
import { bloggersRepository } from "./bloggers-repository";
import { posts } from "./db";

export const postRepository = {
  getIndexById(id: number) {
    return posts.findIndex((post) => post.id === id);
  },
  getPosts() {
    return posts;
  },
  getPostById(id: number) {
    return posts.find((post) => post.id === id);
  },
  deletePostById(id: number) {
    const indexForRemove = this.getIndexById(id);
    if (indexForRemove === -1) {
      return false;
    }
    posts.splice(indexForRemove, 1);
    return true;
  },
  updatePostById(id: number, postDto: UpdatePostDto) {
    const postIndex = this.getIndexById(id);
    if (postIndex === -1) {
      return false;
    }
    const newPost = {
      ...posts[postIndex],
      ...postDto,
    };

    posts[postIndex] = newPost;
    return posts[postIndex];
  },
  createPost(postDto: PostDto) {
    const blogger = bloggersRepository.getBloggerById(postDto.bloggerId);
    if (!blogger) {
      return false;
    }
    const newPost: Post = {
      id: getRandomNumber(),
      title: postDto.title,
      shortDescription: postDto.shortDescription,
      content: postDto.content,
      bloggerId: postDto.bloggerId,
    };
    posts.push(newPost);
    return newPost;
  },
};
