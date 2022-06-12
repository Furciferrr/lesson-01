import { TYPES } from "./../IocTypes";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { CommentDto, PostDto, UpdatePostDto } from "../dto";
import {
  IBloggerService,
  IBodyValidator,
  ICommentsService,
  IPostService,
} from "../interfaces";

@injectable()
export class PostController {
  constructor(
    @inject(TYPES.BloggerService)
    private readonly bloggersService: IBloggerService,
    @inject(TYPES.PostService)
    private readonly postsService: IPostService,
    @inject(TYPES.BodyValidator)
    private readonly bodyValidator: IBodyValidator,
    @inject(TYPES.CommentService)
    private readonly commentService: ICommentsService
  ) {}

  async createPost(req: Request, res: Response) {
    const conversionResult = await this.bodyValidator.validateAndConvert(
      PostDto,
      req.body
    );
    if (conversionResult.error) {
      return res.status(400).send(conversionResult.error);
    }
    const blogger = await this.bloggersService.getBloggerById(
      req.body.bloggerId
    );
    if (!blogger) {
      return res.status(400).send({
        errorsMessages: [
          { message: "bloggerId incorrect", field: "bloggerId" },
        ],
       // resultCode: 1,
      });
    }
    const newPost = await this.postsService.createPost(req.body);
    if (!newPost) {
      return res.status(400).send();
    }
    //@ts-ignore
    newPost.bloggerId = newPost.bloggerId;
    res.status(201).send(newPost);
  }

  async getPosts(req: Request, res: Response) {
    const pageNumber = req.query.PageNumber as string;
    const pageSize = req.query.PageSize as string;

    const posts = await this.postsService.getPosts(+pageNumber, +pageSize);
    res.send(posts);
  }

  async getPostById(req: Request, res: Response) {
    const foundPost = await this.postsService.getPostById(req.params.id);

    if (!foundPost) {
      return res.status(404).send();
    }

    res.send(foundPost);
  }

  async updatePostById(req: Request, res: Response) {
    if (!Object.keys(req.body).length) {
      return res.sendStatus(400);
    }
    const conversionResult = await this.bodyValidator.validateAndConvert(
      UpdatePostDto,
      req.body
    );

    if (conversionResult.error) {
      return res.status(400).send(conversionResult.error);
    }

    const blogger = await this.bloggersService.getBloggerById(
      req.body.bloggerId
    );
    if (!blogger) {
      return res.status(400).send({
        errorsMessages: [
          { message: "bloggerId incorrect", field: "bloggerId" },
        ],
       // resultCode: 1,
      });
    }

    const updatedPost = await this.postsService.updatePostById(
      req.params.id,
      req.body
    );
    res.sendStatus(updatedPost);
  }

  async deletePostById(req: Request, res: Response) {
    const isRemoved = await this.postsService.deletePostById(req.params.id);
    if (!isRemoved) {
      return res.sendStatus(404);
    }

    if (isRemoved) {
      res.sendStatus(204);
    }
  }

  async createComment(req: Request, res: Response) {
    const conversionResult = await this.bodyValidator.validateAndConvert(
      CommentDto,
      req.body
    );
    if (conversionResult.error) {
      return res.status(400).send(conversionResult.error);
    }
    const foundPost = await this.postsService.getPostById(req.params.id);
    if (!foundPost) {
      return res.status(404).send();
    }
    const newComment = await this.commentService.createComment(
      req.params.id,
      req.body,
      //@ts-ignore
      req.user
    );
    if (!newComment) {
      return res.status(400).send();
    }
    const { postId, ...commentResponse } = newComment;
    res.status(201).send(commentResponse);
  }

  async getCommentsByPostId(req: Request, res: Response) {
    const pageNumber = req.query.PageNumber as string;
    const pageSize = req.query.PageSize as string;
    const foundPost = await this.postsService.getPostById(req.params.id);
    if (!foundPost) {
      return res.status(404).send();
    }
    const comments = await this.commentService.getCommentsByPostId(
      req.params.id,
      +pageNumber,
      +pageSize
    );

    return res.send(comments);
  }
}
