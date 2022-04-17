import express, { Request, Response } from "express";
import { PostDto, UpdatePostDto } from "../dto";
import { postsService } from "../services/posts-service";
import { validateAndConvert } from "../validator";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const conversionResult = await validateAndConvert(PostDto, req.body);
  if (conversionResult.error) {
    return res.status(400).send(conversionResult.error);
  }
  const newPost = await postsService.createPost(req.body);
  if (!newPost) {
    return res.status(400).send();
  }
  res.status(201).send(newPost);
});

router.get("/", async (req: Request, res: Response) => {
  const posts = await postsService.getPosts();
  res.send(posts);
});

router.get("/:id", async (req: Request, res: Response) => {
  const foundPost = await postsService.getPostById(+req.params.id);

  if (!foundPost) {
    return res.status(404).send();
  }
  res.send(foundPost);
});

router.put("/:id", async (req: Request, res: Response) => {
  if (!Object.keys(req.body).length) {
    return res.sendStatus(400);
  }
  const conversionResult = await validateAndConvert(UpdatePostDto, req.body);
  if (conversionResult.error) {
    return res.status(400).send(conversionResult.error);
  }

  const updatedPost = await postsService.updatePostById(
    +req.params.id,
    req.body
  );

  res.sendStatus(updatedPost);
});

router.delete("/:id", async (req: Request, res: Response) => {
  const isRemoved = await postsService.deletePostById(+req.params.id);
  if (!isRemoved) {
    return res.sendStatus(404);
  }

  if (isRemoved) {
    res.sendStatus(204);
  }
});

export default router;
