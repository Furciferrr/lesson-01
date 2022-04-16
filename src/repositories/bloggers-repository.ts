import { ObjectId, WithId } from "mongodb";
import { BloggerDto } from "../dto";
import { Blogger, Post } from "../types";
import { getRandomNumber } from "../utils";
import { bloggersCollection, postsCollection } from "./db-config";
const { writeJSONToFile } = require("../utils/fs-utils.js");

export const bloggersRepository = {
  removeId<T extends { _id: ObjectId }>(array: T[]): Omit<T, "_id">[] {
    return array.map((item) => {
      const { _id, ...other } = item;
      return other;
    });
  },
  async getBloggers(): Promise<Array<Blogger>> {
    const bloggers: Array<Blogger> = await bloggersCollection
      .find({}, { projection: { _id: 0 } })
      .toArray();
    return bloggers;
  },
  async getBloggerById(id: number): Promise<Blogger | null> {
    const bloggers: Blogger | null = await bloggersCollection.findOne(
      { id },
      { projection: { _id: 0 } }
    );
    return bloggers;
  },
  async deleteBloggerById(id: number): Promise<boolean> {
    try {
      const result = await bloggersCollection.deleteOne({ id });
      if (result.deletedCount === 1) {
        await postsCollection.deleteMany({ bloggerId: id });
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  },
  async updateBloggerById(id: number, dto: BloggerDto): Promise<boolean> {
    const result = await bloggersCollection.updateOne(
      { id },
      { $set: { ...dto } }
    );

    return result.matchedCount === 1;
  },
  async createBlogger(blogger: BloggerDto): Promise<Blogger> {
    const newBlogger: Blogger = {
      id: getRandomNumber(),
      name: blogger.name,
      youtubeUrl: blogger.youtubeUrl,
    };
    await bloggersCollection.insertOne(newBlogger, {
      forceServerObjectId: true,
    });
    return newBlogger;
  },
};
