import { PostController } from "./../controllers/posts";
import express from "express";
import { authMiddleware } from "../middlewares/auth-middleware";
import { authBaseMiddleware } from "../middlewares/basic-middleware";
import { ioc } from "../IocContainer";
import { TYPES } from "../IocTypes";

const router = express.Router();

const postController = ioc.get<PostController>(TYPES.PostController);

router.post(
  "/",
  authMiddleware,
  postController.createPost.bind(postController)
);

router.get("/", postController.getPosts.bind(postController));

router.get("/:id", postController.getPostById.bind(postController));

router.put(
  "/:id",
  authMiddleware,
  postController.updatePostById.bind(postController)
);

router.delete(
  "/:id",
  authMiddleware,
  postController.deletePostById.bind(postController)
);

router.post(
  "/:id/comments",
  authMiddleware,
  postController.createComment.bind(postController)
);

router.get(
  "/:id/comments",
  postController.getCommentsByPostId.bind(postController)
);

export default router;
