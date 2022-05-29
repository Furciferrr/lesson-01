import {
  IBloggerRepository,
  IBloggerService,
  IPostRepository,
} from "./../interfaces";
import { ObjectId } from "mongodb";
import { BloggerDto } from "../dto";
import { Blogger, ResponseType } from "../types";
import { getRandomNumber } from "../utils";
import { inject, injectable } from "inversify";
import { TYPES } from "../IocTypes";

@injectable()
export class BloggerService implements IBloggerService {
  constructor(
    @inject(TYPES.BloggerRepository)
    private readonly bloggersRepository: IBloggerRepository,
    @inject(TYPES.PostRepository)
    private readonly postRepository: IPostRepository
  ) {}
  removeId<T extends { _id: ObjectId }>(array: T[]): Omit<T, "_id">[] {
    return array.map((item) => {
      const { _id, ...other } = item;
      return other;
    });
  }
  async getBloggers(
    pageNumber = 1,
    pageSize = 10,
    searchTerm?: string
  ): Promise<ResponseType<Blogger>> {
    const bloggers: Array<Blogger> = await this.bloggersRepository.getBloggers(
      pageNumber || 1,
      pageSize || 10,
      searchTerm
    );
    const totalCount = await this.bloggersRepository.getTotalCount(searchTerm);
    const pagesCount = Math.ceil(totalCount / (pageSize || 10));
    const buildResponse = {
      pagesCount,
      page: pageNumber || 1,
      pageSize: pageSize || 10,
      totalCount,
      items: bloggers,
    };
    return buildResponse;
  }
  async getBloggerById(id: string): Promise<Blogger | null> {
    const blogger: Blogger | null =
      await this.bloggersRepository.getBloggerById(id);
    return blogger;
  }
  async deleteBloggerById(id: string): Promise<boolean> {
    const result = await this.bloggersRepository.deleteBloggerById(id);
    if (result) {
      await this.postRepository.deletePostsByBloggerId(id);
      return true;
    } else {
      return false;
    }
  }
  async updateBloggerById(id: string, dto: BloggerDto): Promise<boolean> {
    return await this.bloggersRepository.updateBloggerById(id, dto);
  }
  async createBlogger(blogger: BloggerDto): Promise<Blogger> {
    const newBlogger: Blogger = {
      id: getRandomNumber().toString(),
      name: blogger.name,
      youtubeUrl: blogger.youtubeUrl,
    };
    await this.bloggersRepository.createBlogger(newBlogger);
    return newBlogger;
  }
}
