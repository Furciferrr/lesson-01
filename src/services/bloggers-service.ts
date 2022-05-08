import { ObjectId } from "mongodb";
import { BloggerDto } from "../dto";
import { Blogger, ResponseType } from "../types";
import { getRandomNumber } from "../utils";
import { bloggersRepository } from "../repositories/bloggers-repository";
import { postRepository } from "../repositories/posts-repository";

export const bloggersService = {
  removeId<T extends { _id: ObjectId }>(array: T[]): Omit<T, "_id">[] {
    return array.map((item) => {
      const { _id, ...other } = item;
      return other;
    });
  },
  async getBloggers(
    pageNumber = 1,
    pageSize = 10,
    searchTerm?: string
  ): Promise<ResponseType<Blogger>> {
    const bloggers: Array<Blogger> = await bloggersRepository.getBloggers(
      pageNumber || 1,
      pageSize || 10,
      searchTerm
    );
    const totalCount = await bloggersRepository.getTotalCount(searchTerm);
    const pagesCount = Math.ceil(totalCount / (pageSize || 10));
    const buildResponse = {
      pagesCount,
      page: pageNumber || 1,
      pageSize: pageSize || 10,
      totalCount,
      items: bloggers,
    };
    return buildResponse;
  },
  async getBloggerById(id: string): Promise<Blogger | null> {
    const bloggers: Blogger | null = await bloggersRepository.getBloggerById(
      id
    );
    return bloggers;
  },
  async deleteBloggerById(id: string): Promise<boolean> {
    const result = await bloggersRepository.deleteBloggerById(id);
    if (result) {
      await postRepository.deletePostsByBloggerId(id);
      return true;
    } else {
      return false;
    }
  },
  async updateBloggerById(id: string, dto: BloggerDto): Promise<boolean> {
    return await bloggersRepository.updateBloggerById(id, dto);
  },
  async createBlogger(blogger: BloggerDto): Promise<Blogger> {
    const newBlogger: Blogger = {
      id: getRandomNumber().toString(),
      name: blogger.name,
      youtubeUrl: blogger.youtubeUrl,
    };
    await bloggersRepository.createBlogger(newBlogger);
    return newBlogger;
  },
};
