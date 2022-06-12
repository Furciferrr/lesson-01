import {
  CommentDBType,
  CommentResponse,
  ResponseType,
  UserViewType,
} from "./../types";
import { CommentDto } from "../dto";
import { getRandomNumber } from "../utils";
import { ICommentsRepository, ICommentsService } from "../interfaces";
import { inject, injectable } from "inversify";
import { TYPES } from "../IocTypes";


@injectable()
export class CommentsService implements ICommentsService {
  constructor(
    @inject(TYPES.CommentRepository)
    private readonly commentRepository: ICommentsRepository
  ) {}
  async getCommentById(id: string): Promise<CommentDBType | null> {
    const result = await this.commentRepository.getCommentById(id);
    return result
  }

  async updateCommentById(
    id: string,
    commentDto: CommentDto
  ): Promise<boolean> {
    return await this.commentRepository.updateCommentById(id, commentDto);
  }

  async deleteCommentById(id: string): Promise<boolean> {
    return await this.commentRepository.deleteCommentById(id);
  }

  async getCommentsByPostId(
    id: string,
    pageNumber = 1,
    pageSize = 10
  ): Promise<ResponseType<CommentResponse>> {
    const resultComments = await this.commentRepository.getCommentsByPostId(
      id,
      pageNumber || 1,
      pageSize || 10
    );
    const totalCount = await this.commentRepository.getTotalCount(id);
    const pagesCount = Math.ceil(totalCount / (pageSize || 10));
    return {
      pagesCount: pagesCount,
      page: pageNumber || 1,
      pageSize: pageSize || 10,
      totalCount: totalCount,
      items: resultComments,
    };
  }

  async createComment(
    postId: string,
    commentDto: CommentDto,
    user: UserViewType
  ): Promise<CommentDBType> {
    const newComment: CommentDBType = {
      id: getRandomNumber().toString(),
      content: commentDto.content,
      userId: user.id.toString(),
      userLogin: user.login,
      addedAt: new Date().toISOString(),
      postId,
    };
    this.commentRepository.createComment(newComment);
    return newComment;
  }
}
