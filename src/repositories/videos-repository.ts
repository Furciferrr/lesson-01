import { videos } from "./db";

export const videosRepository = {
  getVideos() {
    return videos;
  },
  getVideoById(id: number) {
    return videos.find((video) => video.id === id);
  },
  deleteVideoById(id: number) {
    const indexForRemove = videos.findIndex((video) => video.id === id);
    if (indexForRemove === -1) {
      return false;
    }
    videos.splice(indexForRemove, 1);
    return true;
  },
  updateVideoById(id: number, title: string) {
    const index = videos.findIndex((video) => video.id === id);
    if (index === -1) {
      return false;
    }
    videos[index].title = title;
    return videos[index];
  },
  createVideo(title: string) {
    const newVideo = {
      id: +new Date(),
      title: title,
      author: "it-incubator.eu",
    };
    videos.push(newVideo);
    return newVideo;
  },
};
