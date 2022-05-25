import { CommentDBType, CommentResponse, DBType } from "./../types";
import { CommentDto } from "../dto";
import { commentsCollection } from "./db-config";
import { ICommentsRepository } from "../interfaces";
import { injectable } from "inversify";


@injectable()
export class CommentsRepository implements ICommentsRepository {
  async getCommentById(id: string): Promise<CommentDBType | null> {
    return commentsCollection.findOne({ id }, { projection: { _id: 0 } });
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
  ): Promise<DBType<CommentResponse>> {
    const result = await commentsCollection
      .aggregate([
        {
          $facet: {
            items: [
              { $match: { postId: id } },
              { $skip: (pageNumber - 1) * pageSize },
              { $limit: pageSize },
              { $project: { _id: 0, postId: 0 } },
            ],
            pagination: [{ $count: "totalCount" }],
          },
        },
      ])
      .toArray();
    return result[0] as DBType<CommentResponse>;
  }

  async createComment(comment: CommentDBType): Promise<CommentDBType> {
    commentsCollection.insertOne(comment, {
      forceServerObjectId: true,
    });
    return comment;
  }
}
