import { postRepository } from "./../repositories/posts-repository";
import { PostDto, UpdatePostDto } from "../dto";
import { DBType, Post, ResponseType } from "../types";
import { getRandomNumber } from "../utils";
import { bloggersService } from "./bloggers-service";

export const postsService = {
  async getPosts(pageNumber = 1, pageSize = 10): Promise<ResponseType<Post>> {
    const posts = await postRepository.getPosts(pageNumber, pageSize);
    const totalCount = await postRepository.getTotalCount();
    const pagesCount = Math.ceil(totalCount / (pageSize || 10));
    const buildResponse = {
      pagesCount,
      page: pageNumber || 1,
      pageSize: pageSize || 10,
      totalCount,
      items: posts,
    };
    return buildResponse;
  },

  async getPostsByBloggerId(
    bloggerId: number,
    pageNumber = 1,
    pageSize = 10
  ): Promise<ResponseType<Post> | false> {
    const blogger = await bloggersService.getBloggerById(bloggerId)
    if(!blogger) {
      return false
    }
    const resultPosts = await postRepository.getPostByBloggerId(
      bloggerId,
      pageNumber || 1,
      pageSize || 10
    );
    const { pagination, ...result } = resultPosts;
    return {
      totalCount: pagination[0].totalCount,
      pageSize: pageSize || 10,
      page: pageNumber | 1,
      pagesCount: Math.ceil(pagination[0].totalCount / (pageSize || 10)),
      ...result,
    };
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

    return result ? 204 : 404;
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
    await postRepository.createPost(newPost);
    return newPost;
  },
};
