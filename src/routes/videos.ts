import { videosRepository } from "./../repositories/videos-repository";
import express, { Request, Response } from "express";
import { VideoDto } from "../dto";
import { validateAndConvert } from "../validator";
import { VideoType } from "../types";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const videos: Array<VideoType> = await videosRepository.getVideos();
  res.send(videos);
});

router.get("/:id", async (req: Request, res: Response) => {
  const foundVideo = await videosRepository.getVideoById(+req.params.id);
  if (!foundVideo) {
    return res.sendStatus(404);
  }
  res.send(foundVideo);
});

router.post("/", async (req: Request, res: Response) => {
  const conversionResult = await validateAndConvert(VideoDto, req.body);
  if (conversionResult.error) {
    return res.status(400).send(conversionResult.error);
  }
  const newVideo = await videosRepository.createVideo(req.body.title);
  if (!newVideo) {
    return res.sendStatus(404);
  }
  res.status(201).send(newVideo);
});

router.delete("/:id", async (req: Request, res: Response) => {
  const isDeleted = await videosRepository.deleteVideoById(+req.params.id);
  if (!isDeleted) {
    return res.sendStatus(404);
  }
  res.sendStatus(204);
});

router.put("/:id", async (req: Request, res: Response) => {
  const conversionResult = await validateAndConvert(VideoDto, req.body);
  if (conversionResult.error) {
    return res.status(400).send(conversionResult.error);
  }
  const updatedVideo = await videosRepository.updateVideoById(
    +req.params.id,
    req.body.title
  );
  if (!updatedVideo) {
    return res.sendStatus(404);
  }
  res.sendStatus(204);
});

export default router;
