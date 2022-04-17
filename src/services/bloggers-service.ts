import { ObjectId } from "mongodb";
import { BloggerDto } from "../dto";
import { Blogger } from "../types";
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
  async getBloggers(): Promise<Array<Blogger>> {
    const bloggers: Array<Blogger> = await bloggersRepository.getBloggers();
    return bloggers;
  },
  async getBloggerById(id: number): Promise<Blogger | null> {
    const bloggers: Blogger | null = await bloggersRepository.getBloggerById(
      id
    );
    return bloggers;
  },
  async deleteBloggerById(id: number): Promise<boolean> {
    const result = await bloggersRepository.deleteBloggerById(id);
    if (result) {
      await postRepository.deletePostsByBloggerId(id);
      return true;
    } else {
      return false;
    }
  },
  async updateBloggerById(id: number, dto: BloggerDto): Promise<boolean> {
    return await bloggersRepository.updateBloggerById(id, dto);
  },
  async createBlogger(blogger: BloggerDto): Promise<Blogger> {
    const newBlogger: Blogger = {
      id: getRandomNumber(),
      name: blogger.name,
      youtubeUrl: blogger.youtubeUrl,
    };
    await bloggersRepository.createBlogger(newBlogger);
    return newBlogger;
  },
};
