import { CommentDBType, CommentResponse, DBType } from "./../types";
import { CommentDto } from "../dto";
import { commentsCollection } from "./db-config";

export const commentRepository = {
  async getCommentById(id: number): Promise<CommentDBType | null> {
    return commentsCollection.findOne({ id }, { projection: { _id: 0 } });
  },

  async updateCommentById(
    id: number,
    commentDto: CommentDto
  ): Promise<boolean> {
    const result = await commentsCollection.updateOne(
      { id },
      { $set: commentDto }
    );
    return result.modifiedCount === 1;
  },

  async deleteCommentById(id: number): Promise<boolean> {
    const result = await commentsCollection.deleteOne({ id });
    return result.deletedCount === 1;
  },

  async getCommentsByPostId(
    id: number,
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
  },

  async createComment(comment: CommentDBType): Promise<CommentDBType> {
    commentsCollection.insertOne(comment, {
      forceServerObjectId: true,
    });
    return comment;
  },
};
