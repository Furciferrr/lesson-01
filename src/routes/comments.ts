import { authMiddleware } from "./../middlewares/auth-middleware";
import express from "express";
import { authBaseMiddleware } from "../middlewares/basic-middleware";
import { CommentsController } from "../controllers/comments";
import { ioc } from "../IocContainer";
import { TYPES } from "../IocTypes";

const router = express.Router();

const commentController = ioc.get<CommentsController>(TYPES.CommentController);

router.get("/:id", commentController.getCommentById.bind(commentController));

router.put(
  "/:id",
  authMiddleware,
  commentController.updateCommentById.bind(commentController)
);

router.delete(
  "/:id",
  authMiddleware,
  commentController.deleteCommentById.bind(commentController)
);

export default router;
