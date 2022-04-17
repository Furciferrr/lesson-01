import { UpdatePostDto } from "../dto";
import { Post } from "../types";
import { postsCollection } from "./db-config";

export const postRepository = {
  async getPosts(): Promise<Post[]> {
    return postsCollection.find({}, { projection: { _id: 0 } }).toArray();
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
  async updatePostById(
    id: number,
    postDto: UpdatePostDto
  ): Promise<400 | 404 | 204> {
    const result = await postsCollection.updateOne(
      { id },
      { $set: postDto }
    );

    return result.modifiedCount === 1 ? 204 : 404;
  },
  async createPost(post: Post) {
    await postsCollection.insertOne(post, {
      forceServerObjectId: true,
    });
    return post;
  },
};
