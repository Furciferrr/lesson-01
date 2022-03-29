import express, { Request, Response } from "express";
import { getRandomNumber } from "../utils";
import { bloggers, posts } from "./../data";
import { Blogger, BloggerBodyType } from "./../types";

const router = express.Router();

router.post("/", (req: Request, res: Response) => {
  const newBlogger: Blogger = {
    id: getRandomNumber(),
    name: req.body.name,
    youtubeUrl: req.body.youtubeUrl,
    posts: [],
  };
  bloggers.push(newBlogger);
  res.status(201).send(newBlogger);
});

router.get("/", (req: Request, res: Response) => {
  res.send(bloggers);
});

router.get("/:id", (req: Request, res: Response) => {
  const foundBlogger = bloggers.find(
    (blogger) => blogger.id === +req.params.id
  );
  if (!foundBlogger) {
    return res.status(404);
  }
  res.send(foundBlogger);
});

export default router;
