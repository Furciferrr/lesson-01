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
    return this.commentRepository.getCommentById(id);
  }

  async updateCommentById(
    id: string,
    commentDto: CommentDto
  ): Promise<boolean> {
    return this.commentRepository.updateCommentById(id, commentDto);
  }

  async deleteCommentById(id: string): Promise<boolean> {
    return this.commentRepository.deleteCommentById(id);
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
    console.log(resultComments)
    const { pagination, ...result } = resultComments;
    return {
      totalCount: pagination[0].totalCount,
      pageSize: pageSize || 10,
      page: pageNumber || 1,
      pagesCount: Math.ceil(pagination[0].totalCount / pageSize),
      ...result,
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
