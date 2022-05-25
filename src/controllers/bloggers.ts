import { TYPES } from "./../IocTypes";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { BloggerDto, PostDtoWithoutBlogger, UpdateBloggerDto } from "../dto";
import { IBloggerService, IBodyValidator, IPostService } from "../interfaces";

@injectable()
export class BloggerController {
  constructor(
    @inject(TYPES.BloggerService)
    private readonly bloggersService: IBloggerService,
    @inject(TYPES.PostService)
    private readonly postsService: IPostService,
    @inject(TYPES.BodyValidator)
    private readonly bodyValidator: IBodyValidator
  ) {}

  async getBloggers(req: Request, res: Response) {
    const pageNumber = req.query.PageNumber as string;
    const pageSize = req.query.PageSize as string;
    const searchTerm = req.query.SearchNameTerm as string;
    const bloggers = await this.bloggersService.getBloggers(
      +pageNumber,
      +pageSize,
      searchTerm
    );
    res.status(200).send(bloggers);
  }

  async getBloggerById(req: Request, res: Response) {
    const foundBlogger = await this.bloggersService.getBloggerById(
      req.params.id
    );
    if (!foundBlogger) {
      return res.status(404).send();
    }
    res.send(foundBlogger);
  }

  async updateBloggerById(req: Request, res: Response) {
    if (!req.body || !Object.keys(req.body).length) {
      return res.sendStatus(400);
    }
    const conversionResult = await this.bodyValidator.validateAndConvert(
      UpdateBloggerDto,
      req.body
    );
    if (conversionResult.error) {
      return res.status(400).send(conversionResult.error);
    }
    const newBlogger = await this.bloggersService.updateBloggerById(
      req.params.id,
      req.body
    );
    if (!newBlogger) {
      return res.sendStatus(404);
    }
    res.sendStatus(204);
  }

  async createBlogger(req: Request, res: Response) {
    const conversionResult = await this.bodyValidator.validateAndConvert(
      BloggerDto,
      req.body
    );
    if (conversionResult.error) {
      return res.status(400).send(conversionResult.error);
    } else {
      const newBlogger = await this.bloggersService.createBlogger(req.body);
      if (!newBlogger) {
        return res.status(400).send({
          errorsMessages: [
            { message: "bloggerId incorrect", field: "bloggerId" },
          ],
          resultCode: 1,
        });
      }
      res.status(201).send(newBlogger);
    }
  }

  async deleteBloggerById(req: Request, res: Response) {
    const result = await this.bloggersService.deleteBloggerById(req.params.id);
    if (!result) {
      return res.sendStatus(404);
    }
    if (result) {
      return res.sendStatus(204);
    }
  }

  async createPost(req: Request, res: Response) {
    const conversionResult = await this.bodyValidator.validateAndConvert(
      PostDtoWithoutBlogger,
      req.body
    );
    if (conversionResult.error) {
      return res.status(400).send(conversionResult.error);
    } else {
      const newPost = await this.postsService.createPost({
        ...req.body,
        bloggerId: req.params.bloggerId,
      });
      if (!newPost) {
        return res.sendStatus(404);
      }
      //@ts-ignore
      newPost.bloggerId = +newPost.bloggerId;
      res.status(201).send(newPost);
    }
  }

  async getPostsByBloggerId(req: Request, res: Response) {
    const pageNumber = req.query.PageNumber as string;
    const pageSize = req.query.PageSize as string;
    const posts = await this.postsService.getPostsByBloggerId(
      req.params.bloggerId,
      +pageNumber,
      +pageSize
    );

    if (!posts) {
      return res.status(404).send();
    }
    res.send(posts);
  }
}
