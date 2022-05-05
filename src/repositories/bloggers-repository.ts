import { BloggerDto } from "../dto";
import { Blogger } from "../types";
import { bloggersCollection } from "./db-config";

export const bloggersRepository = {
  async getBloggers(
    pageNumber: number,
    pageSize: number
  ): Promise<Array<Blogger>> {
    const bloggers: Array<Blogger> = await bloggersCollection
      .find({}, { projection: { _id: 0 } })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();
    return bloggers;
  },
  async getTotalCount(): Promise<number> {
    return await bloggersCollection.countDocuments();
  },

  async getBloggerById(id: number): Promise<Blogger | null> {
    const blogger: Blogger | null = await bloggersCollection.findOne(
      { id },
      { projection: { _id: 0 } }
    );
    return blogger;
  },
  async deleteBloggerById(id: number): Promise<boolean> {
    const result = await bloggersCollection.deleteOne({ id });
    return result.deletedCount === 1;
  },
  async updateBloggerById(id: number, dto: BloggerDto): Promise<boolean> {
    const result = await bloggersCollection.updateOne(
      { id },
      { $set: { ...dto } }
    );

    return result.matchedCount === 1;
  },
  async createBlogger(blogger: Blogger): Promise<Blogger> {
    await bloggersCollection.insertOne(blogger, {
      forceServerObjectId: true,
    });
    return blogger;
  },
};
