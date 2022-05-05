import { postsService } from "./../services/posts-service";
import express, { Request, Response } from "express";
import {
  BloggerDto,
  PostDtoWithoutBlogger,
  UpdateBloggerDto,
} from "../dto";
import { validateAndConvert } from "../validator";
import { bloggersService } from "../services/bloggers-service";
import { authMiddleware } from "../middlewares/auth-middleware";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const pageNumber = req.query.pageNumber as string;
  const pageSize = req.query.pageSize as string;

  const bloggers = await bloggersService.getBloggers(+pageNumber, +pageSize);

  res.status(200).send(bloggers);
});

router.get("/:id", async (req: Request, res: Response) => {
  const foundBlogger = await bloggersService.getBloggerById(+req.params.id);

  if (!foundBlogger) {
    return res.status(404).send();
  }
  res.send(foundBlogger);
});

router.put("/:id", async (req: Request, res: Response) => {
  if (!req.body || !Object.keys(req.body).length) {
    return res.sendStatus(400);
  }

  const conversionResult = await validateAndConvert(UpdateBloggerDto, req.body);

  if (conversionResult.error) {
    return res.status(400).send(conversionResult.error);
  }

  const newBlogger = await bloggersService.updateBloggerById(
    +req.params.id,
    req.body
  );

  if (!newBlogger) {
    return res.sendStatus(404);
  }

  res.sendStatus(204);
});

router.post("/", async (req: Request, res: Response) => {
  const conversionResult = await validateAndConvert(BloggerDto, req.body);
  if (conversionResult.error) {
    return res.status(400).send(conversionResult.error);
  } else {
    const newBlogger = await bloggersService.createBlogger(req.body);
    if (!newBlogger) {
      return res.sendStatus(400);
    }
    res.status(201).send(newBlogger);
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const result = await bloggersService.deleteBloggerById(+req.params.id);
  if (!result) {
    return res.sendStatus(404);
  }
  if (result) {
    return res.sendStatus(204);
  }
});

router.post(
  "/:bloggerId/posts",
  authMiddleware,
  async (req: Request, res: Response) => {
    const conversionResult = await validateAndConvert(
      PostDtoWithoutBlogger,
      req.body
    );
    if (conversionResult.error) {
      return res.status(400).send(conversionResult.error);
    } else {
      const newPost = await postsService.createPost({
        ...req.body,
        bloggerId: +req.params.bloggerId,
      });
      if (!newPost) {
        return res.sendStatus(400);
      }
      res.status(201).send(newPost);
    }
  }
);

router.get("/:bloggerId/posts", async (req: Request, res: Response) => {
  const pageNumber = req.query.pageNumber as string;
  const pageSize = req.query.pageSize as string;
  const posts = await postsService.getPostsByBloggerId(
    +req.params.bloggerId,
    +pageNumber,
    +pageSize
  );

  if (!posts) {
    return res.status(404).send();
  }
  res.send(posts);
});

export default router;
