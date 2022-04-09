import { BloggerDto } from "../dto";
import { Blogger } from "../types";
import { getRandomNumber } from "../utils";
import { bloggers, posts } from "./db";

export const bloggersRepository = {
  getIndexById(id: number) {
    return bloggers.findIndex((blogger) => blogger.id === id);
  },
  getBloggers() {
    return bloggers;
  },
  getBloggerById(id: number) {
    return bloggers.find((video) => video.id === id);
  },
  deleteBloggerById(id: number) {
    const indexForRemove = this.getIndexById(id);
    if (indexForRemove === -1) {
      return false;
    }
    posts.forEach((post, index) => {
      if (post.bloggerId === bloggers[indexForRemove].id) {
        posts.splice(index, 1);
      }
    });
    bloggers.splice(indexForRemove, 1);
    return true;
  },
  updateBloggerById(id: number, dto: BloggerDto) {
    const index = this.getIndexById(id);
    if (index === -1) {
      return false;
    }
    const updatedBlogger = {
      ...bloggers[index],
      ...dto,
    };
    bloggers[index] = updatedBlogger;
    return true;
  },
  createBlogger(blogger: BloggerDto) {
    const newBlogger: Blogger = {
      id: getRandomNumber(),
      name: blogger.name,
      youtubeUrl: blogger.youtubeUrl,
    };
    bloggers.push(newBlogger);
    return newBlogger;
  },
};
