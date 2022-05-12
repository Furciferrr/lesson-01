import express, { Request, Response } from "express";
import { CommentDto, PostDto, UpdatePostDto } from "../dto";
import { authMiddleware } from "../middlewares/auth-middleware";
import { authBaseMiddleware } from "../middlewares/basic-middleware";
import { bloggersService } from "../services/bloggers-service";
import { commentService } from "../services/comments-service";
import { postsService } from "../services/posts-service";
import { validateAndConvert } from "../validator";

const router = express.Router();

router.post("/", authBaseMiddleware, async (req: Request, res: Response) => {
  const conversionResult = await validateAndConvert(PostDto, req.body);
  if (conversionResult.error) {
    return res.status(400).send(conversionResult.error);
  }
  const blogger = await bloggersService.getBloggerById(req.body.bloggerId);
  if (!blogger) {
    return res.status(400).send({
      errorsMessages: [{ message: "bloggerId incorrect", field: "bloggerId" }],
      resultCode: 1,
    });
  }
  const newPost = await postsService.createPost(req.body);
  if (!newPost) {
    return res.status(400).send();
  }
  //@ts-ignore
  newPost.bloggerId = +newPost.bloggerId;
  res.status(201).send(newPost);
});

router.get("/", async (req: Request, res: Response) => {
  const pageNumber = req.query.PageNumber as string;
  const pageSize = req.query.PageSize as string;

  const posts = await postsService.getPosts(+pageNumber, +pageSize);
  res.send(posts);
});

router.get("/:id", async (req: Request, res: Response) => {
  const foundPost = await postsService.getPostById(req.params.id);

  if (!foundPost) {
    return res.status(404).send();
  }
  res.send(foundPost);
});

router.put("/:id", authBaseMiddleware, async (req: Request, res: Response) => {
  if (!Object.keys(req.body).length) {
    return res.sendStatus(400);
  }
  const conversionResult = await validateAndConvert(UpdatePostDto, req.body);

  if (conversionResult.error) {
    return res.status(400).send(conversionResult.error);
  }

  const blogger = await bloggersService.getBloggerById(req.body.bloggerId);
  if (!blogger) {
    return res.status(400).send({
      errorsMessages: [{ message: "bloggerId incorrect", field: "bloggerId" }],
      resultCode: 1,
    });
  }

  const updatedPost = await postsService.updatePostById(
    req.params.id,
    req.body
  );
  if (updatedPost) {
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
});

router.delete(
  "/:id",
  authBaseMiddleware,
  async (req: Request, res: Response) => {
    const isRemoved = await postsService.deletePostById(req.params.id);
    if (!isRemoved) {
      return res.sendStatus(404);
    }

    if (isRemoved) {
      res.sendStatus(204);
    }
  }
);

router.post(
  "/:id/comments",
  authMiddleware,
  async (req: Request, res: Response) => {
    const conversionResult = await validateAndConvert(CommentDto, req.body);
    if (conversionResult.error) {
      return res.status(400).send(conversionResult.error);
    }
    const foundPost = await postsService.getPostById(req.params.id);
    if (!foundPost) {
      return res.status(404).send();
    }
    const newComment = await commentService.createComment(
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
);

router.get(
  "/:id/comments",
  authMiddleware,
  async (req: Request, res: Response) => {
    const pageNumber = req.query.PageNumber as string;
    const pageSize = req.query.PageSize as string;
    const foundPost = await postsService.getPostById(req.params.id);
    if (!foundPost) {
      return res.status(404).send();
    }
    const comments = await commentService.getCommentsByPostId(
      req.params.id,
      +pageNumber,
      +pageSize
    );

    return res.send(comments);
  }
);

router.delete(
  "/:id/comments",
  authMiddleware,
  async (req: Request, res: Response) => {
    const foundPost = await postsService.getPostById(req.params.id);
    if (!foundPost) {
      return res.status(404).send();
    }

    const comment = await commentService.getCommentById(req.params.id);
    //@ts-ignore
    if (comment?.userId !== req.user?.id) {
      return res.sendStatus(403);
    }

    return res.sendStatus(204);
  }
);

export default router;
