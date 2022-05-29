import { injectable } from "inversify";
import { UpdatePostDto } from "../dto";
import { IPostRepository } from "../interfaces";
import { DBType, Post } from "../types";
import { postsCollection } from "./db-config";


@injectable()
export class PostRepository implements IPostRepository {
  async getPosts(pageNumber: number, pageSize: number): Promise<Post[]> {
    return postsCollection
      .find({})
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .select(["-_id", "-__v"]);
  }
  async getTotalCount(): Promise<number> {
    return await postsCollection.countDocuments();
  }
  async getPostById(id: string): Promise<Post | null> {
    return postsCollection.findOne({ id }, { projection: { _id: 0 } });
  }
  async deletePostById(id: string): Promise<boolean> {
    const result = await postsCollection.deleteOne({ id });
    return result.deletedCount === 1;
  }
  async deletePostsByBloggerId(id: string): Promise<boolean> {
    try {
      await postsCollection.deleteMany({ bloggerId: id });
      return true;
    } catch (e) {
      return false;
    }
  }

  async updatePostById(id: string, postDto: UpdatePostDto): Promise<boolean> {
    const result = await postsCollection.updateOne({ id }, { $set: postDto });
    return result.modifiedCount === 1;
  }

  async createPost(post: Post): Promise<Post> {
    await postsCollection.create(post);
    return post;
  }

  async getPostByBloggerId(
    bloggerId: string,
    pageNumber: number,
    pageSize: number
  ): Promise<DBType<Post>> {
    const result = await postsCollection
      .aggregate([
        {
          $facet: {
            items: [
              { $match: { bloggerId } },
              { $skip: (pageNumber - 1) * pageSize },
              { $limit: pageSize },
              { $project: { _id: 0, postId: 0 } },
            ],
            pagination: [{ $count: "totalCount" }],
          },
        },
      ])
    return result[0] as DBType<Post>;
  }
}
