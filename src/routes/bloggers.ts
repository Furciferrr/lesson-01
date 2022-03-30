import express, { Request, Response } from "express";
import { getRandomNumber } from "../utils";
import { bloggers, posts } from "./../data";
import { Blogger } from "./../types";
import { BloggerDto } from "../dto";
import { validateAndConvert } from "../validator";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const conversionResult = await validateAndConvert(BloggerDto, req.body);
  if (conversionResult.error) {
    res.status(400).send(conversionResult.error);
  } else {
    const newBlogger: Blogger = {
      id: getRandomNumber(),
      name: req.body.name,
      youtubeUrl: req.body.youtubeUrl,
      posts: [],
    };
    bloggers.push(newBlogger);
    res.status(201).send(newBlogger);
  }
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

router.put("/:id", (req: Request, res: Response) => {
  const isBloggerExist = bloggers.findIndex(
    (blogger) => blogger.id === +req.params.id
  );
  if (isBloggerExist === -1) {
    res.send(404);
  }
  bloggers.forEach((blogger) => {
    if (blogger.id === +req.params.id) {
      if (req.body.name) {
        blogger.name = req.body.name;
      }
      if (req.body.youtubeUrl) {
        blogger.youtubeUrl = req.body.youtubeUrl;
      }
      res.send(204);
    }
  });
});

export default router;
