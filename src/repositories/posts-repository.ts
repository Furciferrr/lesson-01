import { PostDto, UpdatePostDto } from "../dto";
import { Post } from "../types";
import { getRandomNumber } from "../utils";
import { bloggersRepository } from "./bloggers-repository";
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
  async updatePostById(id: number, postDto: UpdatePostDto): Promise<400 | 404 | 204> {
    const blogger = await bloggersRepository.getBloggerById(postDto.bloggerId);
    if (!blogger) {
      return 400;
    }
    const result = await postsCollection.updateOne(
      { id },
      { $set: { ...postDto, bloggerName: blogger.name } }
    );
  
    return result.modifiedCount === 1 ? 204 : 404;
  },
  async createPost(postDto: PostDto) {
    const blogger = await bloggersRepository.getBloggerById(postDto.bloggerId);
    if (!blogger) {
      return false;
    }
    const newPost: Post = {
      id: getRandomNumber(),
      title: postDto.title,
      shortDescription: postDto.shortDescription,
      content: postDto.content,
      bloggerId: postDto.bloggerId,
      bloggerName: blogger.name
    };
    await postsCollection.insertOne(newPost, {
      forceServerObjectId: true,
    });
    return newPost;
  },
};
