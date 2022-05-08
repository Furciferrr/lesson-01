import { authMiddleware } from "./../middlewares/auth-middleware";
import { commentService } from "./../services/comments-service";
import express, { Request, Response } from "express";
import { CommentDto } from "../dto";
import { authBaseMiddleware } from "../middlewares/basic-middleware";
import { validateAndConvert } from "../validator";

const router = express.Router();

router.get("/:id", async (req: Request, res: Response) => {
  const comment = await commentService.getCommentById(+req.params.id);

  if (!comment) {
    return res.status(404).send();
  }
  res.send(comment);
});

router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
  if (!Object.keys(req.body).length) {
    return res.sendStatus(400);
  }
  const conversionResult = await validateAndConvert(CommentDto, req.body);
  if (conversionResult.error) {
    return res.status(400).send(conversionResult.error);
  }

  const comment = await commentService.getCommentById(+req.params.id);

  if (comment?.userId !== req.user?.id) {
    return res.sendStatus(403);
  }

  const updatedComment = await commentService.updateCommentById(
    +req.params.id,
    req.body
  );

  if (updatedComment) {
    res.sendStatus(204);
  } else {
    res.sendStatus(400);
  }
});

router.delete(
  "/:id",
  authBaseMiddleware,
  async (req: Request, res: Response) => {
    const comment = await commentService.getCommentById(+req.params.id);

    if (comment?.userId !== req.user?.id) {
      return res.sendStatus(403);
    }
    const isRemoved = await commentService.deleteCommentById(+req.params.id);
    if (!isRemoved) {
      return res.sendStatus(404);
    }

    if (isRemoved) {
      res.sendStatus(204);
    }
  }
);

export default router;
