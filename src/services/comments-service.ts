import { CommentDBType, CommentResponse, ResponseType, UserViewType } from "./../types";
import { CommentDto } from "../dto";
import { commentRepository } from "../repositories/comments-repository";
import { getRandomNumber } from "../utils";

export const commentService = {
  async getCommentById(id: number): Promise<CommentDBType | null> {
    return commentRepository.getCommentById(id);
  },

  async updateCommentById(
    id: number,
    commentDto: CommentDto
  ): Promise<boolean> {
    return commentRepository.updateCommentById(id, commentDto);
  },

  async deleteCommentById(id: number): Promise<boolean> {
    return commentRepository.deleteCommentById(id);
  },

  async getCommentsByPostId(
    id: number,
    pageNumber = 1,
    pageSize = 10
  ): Promise<ResponseType<CommentResponse>> {
    const resultComments = await commentRepository.getCommentsByPostId(
      id,
      pageNumber || 1,
      pageSize || 10
    );
    const { pagination, ...result } = resultComments;
    return {
      totalCount: pagination[0].totalCount,
      pageSize,
      page: pageNumber,
      pagesCount: Math.ceil(pagination[0].totalCount / pageSize),
      ...result,
    };
  },

  async createComment(postId: number, commentDto: CommentDto, user: UserViewType) {
    const newComment: CommentDBType = {
      id: getRandomNumber(),
      content: commentDto.content,
      userId: user.id.toString(),
      userLogin: user.login,
      addedAt: new Date().toISOString(),
      postId,
    };
    commentRepository.createComment(newComment);
    return newComment;
  },
};
