import { UpdatePostDto } from "../dto";
import { DBType, Post } from "../types";
import { postsCollection } from "./db-config";

export const postRepository = {
  async getPosts(pageNumber: number, pageSize: number): Promise<Post[]> {
    return postsCollection
      .find({}, { projection: { _id: 0 } })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();
  },
  async getTotalCount(): Promise<number> {
    return await postsCollection.countDocuments();
  },
  async getPostById(id: number): Promise<Post | null> {
    return postsCollection.findOne({ id }, { projection: { _id: 0 } });
  },
  async deletePostById(id: number): Promise<boolean> {
    const result = await postsCollection.deleteOne({ id });
    return result.deletedCount === 1;
  },
  async deletePostsByBloggerId(id: number): Promise<boolean> {
    try {
      await postsCollection.deleteMany({ bloggerId: id });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  async updatePostById(id: number, postDto: UpdatePostDto): Promise<boolean> {
    const result = await postsCollection.updateOne({ id }, { $set: postDto });

    return result.modifiedCount === 1;
  },
  async createPost(post: Post) {
    await postsCollection.insertOne(post, {
      forceServerObjectId: true,
    });
    return post;
  },

  async getPostByBloggerId(
    bloggerId: number,
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
      .toArray();
    return result[0] as DBType<Post>;
  },
};
