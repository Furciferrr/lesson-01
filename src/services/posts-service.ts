import { postRepository } from "./../repositories/posts-repository";
import { PostDto, UpdatePostDto } from "../dto";
import { Post } from "../types";
import { getRandomNumber } from "../utils";
import { bloggersService } from "./bloggers-service";

export const postsService = {
  async getPosts(): Promise<Post[]> {
    return postRepository.getPosts();
  },
  async getPostById(id: number): Promise<Post | null> {
    return postRepository.getPostById(id);
  },
  async deletePostById(id: number): Promise<boolean> {
    return await postRepository.deletePostById(id);
  },
  async updatePostById(
    id: number,
    postDto: UpdatePostDto
  ): Promise<400 | 404 | 204> {
    const blogger = await bloggersService.getBloggerById(postDto.bloggerId);
    if (!blogger) {
      return 400;
    }
    const result = await postRepository.updatePostById(id, postDto);

    return result;
  },
  async createPost(postDto: PostDto) {
    const blogger = await bloggersService.getBloggerById(postDto.bloggerId);
    if (!blogger) {
      return false;
    }
    const newPost: Post = {
      id: getRandomNumber(),
      title: postDto.title,
      shortDescription: postDto.shortDescription,
      content: postDto.content,
      bloggerId: postDto.bloggerId,
      bloggerName: blogger.name,
    };
    await postRepository.createPost(newPost)
    return newPost;
  },
};
