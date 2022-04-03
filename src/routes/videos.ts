import express, { Request, Response } from "express";
import { PostDto, UpdatePostDto, VideoDto } from "../dto";
import { Post } from "../types";
import { getRandomNumber } from "../utils";
import { validateAndConvert } from "../validator";
import { bloggers, posts } from "./../data";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.send(videos);
});

router.get("/:id", (req: Request, res: Response) => {
  const foundVideo = videos.find((video) => video.id === +req.params.id);
  if (!foundVideo) {
    return res.send(404);
  }
  res.send(foundVideo);
});

router.post("/", async (req: Request, res: Response) => {
  const conversionResult = await validateAndConvert(VideoDto, req.body);
  if (conversionResult.error) {
    return res.status(400).send(conversionResult.error);
  }
  const newVideo = {
    id: +new Date(),
    title: req.body.title,
    author: "it-incubator.eu",
  };
  videos.push(newVideo);
  res.status(201).send(newVideo);
});

router.delete("/:id", (req: Request, res: Response) => {
  const indexForRemove = videos.findIndex(
    (video) => video.id === +req.params.id
  );
  if (indexForRemove === -1) {
    res.send(404);
  }
  videos.splice(indexForRemove, 1);
  res.send(videos);
});

router.put("/:id", async (req: Request, res: Response) => {
  const conversionResult = await validateAndConvert(VideoDto, req.body);
  if (conversionResult.error) {
    return res.status(400).send(conversionResult.error);
  }
  const index = videos.findIndex((video) => video.id === +req.params.id);
  if (index === -1) {
    return res.send(404);
  }
  videos[index].title = req.body.title;
  res.send(videos[index]);
});

const videos = [
  { id: 1, title: "About JS - 01", author: "it-incubator.eu" },
  { id: 2, title: "About JS - 02", author: "it-incubator.eu" },
  { id: 3, title: "About JS - 03", author: "it-incubator.eu" },
  { id: 4, title: "About JS - 04", author: "it-incubator.eu" },
  { id: 5, title: "About JS - 05", author: "it-incubator.eu" },
];

export default router;
