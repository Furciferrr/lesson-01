import express, { Request, Response } from "express";
import { PostDto, UpdatePostDto } from "../dto";
import { Post } from "../types";
import { getRandomNumber } from "../utils";
import { validateAndConvert } from "../validator";
import { bloggers, posts } from "./../data";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const conversionResult = await validateAndConvert(PostDto, req.body);
  if (conversionResult.error) {
    return res.status(400).send(conversionResult.error);
  }
  const blogger = bloggers.find((blogger) => blogger.id === req.body.bloggerId);
  if (!blogger) {
    return res.status(404).send("blogger not exist");
  }
  const newPost: Post = {
    id: getRandomNumber(),
    title: req.body.title,
    shortDescription: req.body.shortDescription,
    content: req.body.content,
    bloggerId: req.body.bloggerId,
    bloggerName: blogger.name,
  };
  posts.push(newPost);
  res.status(201).send(newPost);
});

router.get("/", (req: Request, res: Response) => {
  res.send(posts);
});

router.get("/:id", (req: Request, res: Response) => {
  const foundPost = posts.find((post) => post.id === +req.params.id);

  if (!foundPost) {
    return res.status(404).send();
  }
  res.send(foundPost);
});

router.put("/:id", async (req: Request, res: Response) => {
  const indexOfPost = posts.findIndex((post) => post.id === +req.params.id);
  if (indexOfPost === -1) {
    res.send(404);
  }
  const conversionResult = await validateAndConvert(UpdatePostDto, req.body);
  if (conversionResult.error) {
    return res.status(400).send(conversionResult.error);
  }

  const { title, shortDescription, content } = req.body;

  const newPost = {
    ...posts[indexOfPost],
    title,
    shortDescription,
    content,
  };

  Object.assign(posts[indexOfPost], newPost);
  res.send(204);
});

router.delete("/:id", (req: Request, res: Response) => {
  const indexForRemove = posts.findIndex((post) => post.id === +req.params.id);
  if (indexForRemove === -1) {
    res.send(404);
  }

  posts.splice(indexForRemove, 1);

  res.send(204);
});

export default router;
