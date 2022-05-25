import express from "express";
import { authBaseMiddleware } from "../middlewares/basic-middleware";
import { BloggerController } from "../controllers/bloggers";
import { ioc } from "../IocContainer";
import { TYPES } from "../IocTypes";

const router = express.Router();

const bloggerController = ioc.get<BloggerController>(TYPES.BloggerController);

router.get("/", bloggerController.getBloggers.bind(bloggerController));

router.get("/:id", bloggerController.getPostsByBloggerId.bind(bloggerController));

router.put(
  "/:id",
  authBaseMiddleware,
  bloggerController.updateBloggerById.bind(bloggerController)
);

router.post(
  "/",
  authBaseMiddleware,
  bloggerController.createBlogger.bind(bloggerController)
);

router.delete(
  "/:id",
  authBaseMiddleware,
  bloggerController.deleteBloggerById.bind(bloggerController)
);

router.post(
  "/:bloggerId/posts",
  authBaseMiddleware,
  bloggerController.createPost.bind(bloggerController)
);

router.get(
  "/:bloggerId/posts",
  bloggerController.getPostsByBloggerId.bind(bloggerController)
);

export default router;
