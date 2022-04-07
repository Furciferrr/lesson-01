import { videosRepository } from "./../repositories/videos-repository";
import express, { Request, Response } from "express";
import { VideoDto } from "../dto";
import { validateAndConvert } from "../validator";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  const videos = videosRepository.getVideos();
  res.send(videos);
});

router.get("/:id", (req: Request, res: Response) => {
  const foundVideo = videosRepository.getVideoById(+req.params.id);
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
  const newVideo = videosRepository.createVideo(req.body.title);
  if (!newVideo) {
    res.send(404);
  }
  res.status(201).send(newVideo);
});

router.delete("/:id", (req: Request, res: Response) => {
  const isDeleted = videosRepository.deleteVideoById(+req.params.id);
  if (!isDeleted) {
    res.send(404);
  }
  res.status(201).send();
});

router.put("/:id", async (req: Request, res: Response) => {
  const conversionResult = await validateAndConvert(VideoDto, req.body);
  if (conversionResult.error) {
    return res.status(400).send(conversionResult.error);
  }
  const updatedVideo = videosRepository.updateVideoById(
    +req.params.id,
    req.body.title
  );
  if (!updatedVideo) {
    res.send(404);
  }
  res.send(updatedVideo);
});

export default router;
