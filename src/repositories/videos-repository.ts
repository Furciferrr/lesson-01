import { injectable } from "inversify";
import { IVideosRepository } from "../interfaces";
import { VideoType } from "../types";
import { videosCollection } from "./db-config";


@injectable()
export class VideosRepository implements IVideosRepository {
  async getVideos(): Promise<VideoType[]> {
    return videosCollection.find({}).select(["-_id", "-__v"]);;
  }
  async getVideoById(id: number): Promise<VideoType | null> {
    return videosCollection.findOne({ id }).select(["-_id", "-__v"]);;;
  }
  async deleteVideoById(id: number): Promise<boolean> {
    const result = await videosCollection.deleteOne({ id });
    return result.deletedCount === 1;
  }
  async updateVideoById(id: number, title: string): Promise<boolean> {
    const result = await videosCollection.updateOne(
      { id },
      { $set: { title } }
    );
    return result.modifiedCount === 1;
  }
  async createVideo(title: string): Promise<VideoType> {
    const newVideo = {
      id: +new Date(),
      title: title,
      author: "it-incubator.eu",
    };
    await videosCollection.create(newVideo);
    return newVideo;
  }
}
