import { BloggerDto } from "../dto";
import { bloggers, posts } from "./db";

export const bloggersRepository = {
  getBloggers() {
    return bloggers;
  },
  getBloggerById(id: number) {
    return bloggers.find((video) => video.id === id);
  },
  deleteBloggerById(id: number) {
    const indexForRemove = bloggers.findIndex((blogger) => blogger.id === id);
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
    const index = bloggers.findIndex((blogger) => blogger.id === id);
    if (index === -1) {
      return false;
    }
  },
  createBlogger(updateBlogger: BloggerDto) {},
};
