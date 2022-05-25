import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { VideoDto } from "../dto";
import {
  IBodyValidator,
  IVideosController,
  IVideosRepository,
} from "../interfaces";
import { TYPES } from "../IocTypes";
import { VideoType } from "../types";

@injectable()
export class VideosController implements IVideosController {
  constructor(
    @inject(TYPES.VideosRepository)
    private readonly repository: IVideosRepository,
    @inject(TYPES.BodyValidator)
    private readonly bodyValidator: IBodyValidator
  ) {}

  async getVideos(req: Request, res: Response) {
    const videos: Array<VideoType> = await this.repository.getVideos();
    res.send(videos);
  }

  async updateVideoById(req: Request, res: Response) {
    const conversionResult = await this.bodyValidator.validateAndConvert(
      VideoDto,
      req.body
    );
    if (conversionResult.error) {
      return res.status(400).send(conversionResult.error);
    }
    const updatedVideo = await this.repository.updateVideoById(
      +req.params.id,
      req.body.title
    );
    if (!updatedVideo) {
      return res.sendStatus(404);
    }
    res.sendStatus(204);
  }

  async deleteVideoById(req: Request, res: Response) {
    const isDeleted = await this.repository.deleteVideoById(+req.params.id);
    if (!isDeleted) {
      return res.sendStatus(404);
    }
    res.sendStatus(204);
  }

  async createVideo(req: Request, res: Response) {
    const conversionResult = await this.bodyValidator.validateAndConvert(
      VideoDto,
      req.body
    );
    if (conversionResult.error) {
      return res.status(400).send(conversionResult.error);
    }
    const newVideo = await this.repository.createVideo(req.body.title);
    if (!newVideo) {
      return res.sendStatus(404);
    }
    res.status(201).send(newVideo);
  }

  async getVideoById(req: Request, res: Response) {
    const foundVideo = await this.repository.getVideoById(+req.params.id);
    if (!foundVideo) {
      return res.sendStatus(404);
    }
    res.send(foundVideo);
  }
}
