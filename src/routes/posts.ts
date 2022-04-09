import express, { Request, Response } from "express";
import { PostDto, UpdatePostDto } from "../dto";
import { postRepository } from "../repositories/posts-repository";
import { validateAndConvert } from "../validator";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const conversionResult = await validateAndConvert(PostDto, req.body);
  if (conversionResult.error) {
    return res.status(400).send(conversionResult.error);
  }
  const newPost = postRepository.createPost(req.body);
  if (!newPost) {
    return res.status(404).send();
  }
  res.status(201).send(newPost);
});

router.get("/", (req: Request, res: Response) => {
  const posts = postRepository.getPosts();
  res.send(posts);
});

router.get("/:id", (req: Request, res: Response) => {
  const foundPost = postRepository.getPostById(+req.params.id);

  if (!foundPost) {
    return res.status(404).send();
  }
  res.send(foundPost);
});

router.put("/:id", async (req: Request, res: Response) => {
  const conversionResult = await validateAndConvert(UpdatePostDto, req.body);
  if (conversionResult.error) {
    return res.status(400).send(conversionResult.error);
  }

  const updatedPost = postRepository.updatePostById(+req.params.id, req.body);

  if (!updatedPost) {
    res.send(404);
  }

  res.send(updatedPost);
});

router.delete("/:id", (req: Request, res: Response) => {
  const isRemoved = postRepository.deletePostById(+req.params.id);
  if (!isRemoved) {
    res.sendStatus(404);
  }

  if (isRemoved) {
    res.send(204);
  }
});

export default router;
