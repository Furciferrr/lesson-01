import { PostDto, UpdatePostDto } from "../dto";
import { posts } from "./db";

export const postRepository = {
  getPosts() {
    return posts;
  },
  getPostById(id: number) {
    return posts.find((post) => post.id === id);
  },
  deletePostById(id: number) {
    const indexForRemove = posts.findIndex((post) => post.id === id);
    if (indexForRemove === -1) {
      return false;
    }
    posts.splice(indexForRemove, 1);
    return true;
  },
  updatePostById(id: number, postDto: UpdatePostDto) {},
  createPost(postDto: PostDto) {},
};
