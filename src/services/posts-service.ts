import { PostDto, UpdatePostDto } from "../dto";
import { DBType, Post, ResponseType } from "../types";
import { getRandomNumber } from "../utils";
import {
  IBloggerRepository,
  IPostRepository,
  IPostService,
} from "../interfaces";
import { inject, injectable } from "inversify";
import { TYPES } from "../IocTypes";


@injectable()
export class PostService implements IPostService {
  constructor(
    @inject(TYPES.PostRepository)
    private readonly postRepository: IPostRepository,
    @inject(TYPES.BloggerRepository)
    private readonly bloggerRepository: IBloggerRepository
  ) {}

  async getPosts(pageNumber = 1, pageSize = 10): Promise<ResponseType<Post>> {
    const posts = await this.postRepository.getPosts(
      pageNumber || 1,
      pageSize || 10
    );
    const totalCount = await this.postRepository.getTotalCount();
    const pagesCount = Math.ceil(totalCount / (pageSize || 10));
    const buildResponse = {
      pagesCount,
      page: pageNumber || 1,
      pageSize: pageSize || 10,
      totalCount,
      items: posts,
    };
    return buildResponse;
  }

  async getPostsByBloggerId(
    bloggerId: string,
    pageNumber = 1,
    pageSize = 10
  ): Promise<ResponseType<Post> | false> {
    const blogger = await this.bloggerRepository.getBloggerById(bloggerId);
    if (!blogger) {
      return false;
    }
    const resultPosts = await this.postRepository.getPostByBloggerId(
      bloggerId,
      pageNumber || 1,
      pageSize || 10
    );
    const { pagination, ...result } = resultPosts;
    return {
      pagesCount: Math.ceil(pagination[0].totalCount / (pageSize || 10)),
      page: pageNumber | 1,
      pageSize: pageSize || 10,
      totalCount: pagination[0].totalCount,
      ...result,
    };
  }

  async getPostById(id: string): Promise<Post | null> {
    return this.postRepository.getPostById(id);
  }
  async deletePostById(id: string): Promise<boolean> {
    return await this.postRepository.deletePostById(id);
  }
  async updatePostById(
    id: string,
    postDto: UpdatePostDto
  ): Promise<400 | 404 | 204> {
    const blogger = await this.bloggerRepository.getBloggerById(
      postDto.bloggerId
    );
    if (!blogger) {
      return 400;
    }
    const result = await this.postRepository.updatePostById(id, postDto);

    return result ? 204 : 404;
  }
  async createPost(postDto: PostDto) {
    const blogger = await this.bloggerRepository.getBloggerById(
      postDto.bloggerId
    );
    if (!blogger) {
      return false;
    }
    const newPost: Post = {
      id: getRandomNumber().toString(),
      title: postDto.title,
      shortDescription: postDto.shortDescription,
      content: postDto.content,
      bloggerId: postDto.bloggerId,
      bloggerName: blogger.name,
    };
    await this.postRepository.createPost(newPost);
    return newPost;
  }
}
