import { injectable } from "inversify";
import { IVideosRepository } from "../interfaces";
import { VideoType } from "../types";
import { videosCollection } from "./db-config";


@injectable()
export class VideosRepository implements IVideosRepository {
  async getVideos(): Promise<VideoType[]> {
    return videosCollection.find({}, { projection: { _id: 0 } }).toArray();
  }
  async getVideoById(id: number): Promise<VideoType | null> {
    return videosCollection.findOne({ id }, { projection: { _id: 0 } });
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
    await videosCollection.insertOne(newVideo, {
      forceServerObjectId: true,
    });
    return newVideo;
  }
}
