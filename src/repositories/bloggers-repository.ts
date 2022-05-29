import { IBloggerRepository } from "./../interfaces";
import { BloggerDto } from "../dto";
import { Blogger } from "../types";
import { bloggersCollection } from "./db-config";
import { injectable } from "inversify";

@injectable()
export class BloggerRepository implements IBloggerRepository {
  async getBloggers(
    pageNumber: number,
    pageSize: number,
    searchTerm?: string
  ): Promise<Array<Blogger>> {
    const bloggers: Array<any> = await bloggersCollection
      .find({ name: { $regex: searchTerm || "" } })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .select(["-_id", "-__v"]);
    return bloggers as Blogger[];
  }
  async getTotalCount(searchTerm?: string): Promise<number> {
    return await bloggersCollection.countDocuments({
      name: { $regex: searchTerm || "" },
    });
  }

  async getBloggerById(id: string): Promise<Blogger | null> {
    const blogger: Blogger | null = await bloggersCollection
      .findOne({ id })
      .select(["-_id", "-__v"]);
    return blogger;
  }
  async deleteBloggerById(id: string): Promise<boolean> {
    const result = await bloggersCollection.deleteOne({ id });
    return result.deletedCount === 1;
  }
  async updateBloggerById(id: string, dto: BloggerDto): Promise<boolean> {
    const result = await bloggersCollection.updateOne(
      { id },
      { $set: { ...dto } }
    );

    return result.matchedCount === 1;
  }
  async createBlogger(blogger: Blogger): Promise<Blogger> {
    await bloggersCollection.create(blogger);
    return blogger;
  }
}
