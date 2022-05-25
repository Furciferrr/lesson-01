import { TYPES } from './../IocTypes';
import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { CommentDto, UserDto } from "../dto";
import { IBodyValidator, ICommentsService, IUserService } from "../interfaces";

@injectable()
export class CommentsController {
  constructor(
    @inject(TYPES.CommentService)
    private readonly commentService: ICommentsService,
    @inject(TYPES.BodyValidator)
    private readonly bodyValidator: IBodyValidator
  ) {}

  async getCommentById(req: Request, res: Response) {
    const comment = await this.commentService.getCommentById(req.params.id);

    if (!comment) {
      return res.status(404).send();
    }
    res.send(comment);
  }

  async updateCommentById(req: Request, res: Response) {
    if (!Object.keys(req.body).length) {
      return res.sendStatus(400);
    }
    const conversionResult = await this.bodyValidator.validateAndConvert(
      CommentDto,
      req.body
    );
    if (conversionResult.error) {
      return res.status(400).send(conversionResult.error);
    }
    const comment = await this.commentService.getCommentById(req.params.id);
    //@ts-ignore
    if (comment?.userId !== req.user?.id) {
      return res.sendStatus(403);
    }
    const updatedComment = await this.commentService.updateCommentById(
      req.params.id,
      req.body
    );
    if (updatedComment) {
      res.sendStatus(204);
    } else {
      res.sendStatus(400);
    }
  }

  async deleteCommentById(req: Request, res: Response) {
    const comment = await this.commentService.getCommentById(req.params.id);

    //@ts-ignore
    if (comment?.userId !== req.user?.id) {
      return res.sendStatus(403);
    }
    const isRemoved = await this.commentService.deleteCommentById(
      req.params.id
    );
    if (!isRemoved) {
      return res.sendStatus(404);
    }

    if (isRemoved) {
      res.sendStatus(204);
    }
  }
}
