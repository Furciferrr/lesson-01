import { CommentDBType, CommentResponse, DBType } from "./../types";
import { CommentDto } from "../dto";
import { commentsCollection } from "./db-config";
import { ICommentsRepository } from "../interfaces";
import { injectable } from "inversify";

@injectable()
export class CommentsRepository implements ICommentsRepository {
  async getCommentById(id: string): Promise<CommentDBType | null> {
    return commentsCollection.findOne({ id }).select(["-_id", "-__v"]);
  }

  async updateCommentById(
    id: string,
    commentDto: CommentDto
  ): Promise<boolean> {
    const result = await commentsCollection.updateOne(
      { id },
      { $set: commentDto }
    );
    return result.modifiedCount === 1;
  }

  async deleteCommentById(id: string): Promise<boolean> {
    const result = await commentsCollection.deleteOne({ id });
    return result.deletedCount === 1;
  }

  async getCommentsByPostId(
    id: string,
    pageNumber: number,
    pageSize: number
  ): Promise<Array<CommentResponse>> {
    const result = await commentsCollection
      .find({ postId: id })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .select(["-_id", "-__v"]);
    return result;
  }

  async getTotalCount(postId: string): Promise<number> {
    return await commentsCollection.countDocuments({
      postId: postId,
    });
  }

  async createComment(comment: CommentDBType): Promise<CommentDBType> {
    commentsCollection.create(comment);
    return comment;
  }
}
