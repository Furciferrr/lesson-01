import { bloggersRepository } from "./../repositories/bloggers-repository";
import express, { Request, Response } from "express";
import { BloggerDto, UpdateBloggerDto } from "../dto";
import { validateAndConvert } from "../validator";
import { bloggersService } from "../services/bloggers-service";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const bloggers = await bloggersService.getBloggers();

  res.status(200).send(bloggers);
});

router.get("/:id", async (req: Request, res: Response) => {
  const foundBlogger = await bloggersService.getBloggerById(+req.params.id);

  if (!foundBlogger) {
    return res.status(404).send();
  }
  res.send(foundBlogger);
});

router.put("/:id", async (req: Request, res: Response) => {
  if (!req.body || !Object.keys(req.body).length) {
    return res.sendStatus(400);
  }

  const conversionResult = await validateAndConvert(UpdateBloggerDto, req.body);

  if (conversionResult.error) {
    return res.status(400).send(conversionResult.error);
  }

  const newBlogger = await bloggersService.updateBloggerById(
    +req.params.id,
    req.body
  );

  if (!newBlogger) {
    return res.sendStatus(404);
  }

  res.sendStatus(204);
});

router.post("/", async (req: Request, res: Response) => {
  const conversionResult = await validateAndConvert(BloggerDto, req.body);
  if (conversionResult.error) {
    return res.status(400).send(conversionResult.error);
  } else {
    const newBlogger = await bloggersService.createBlogger(req.body);
    if (!newBlogger) {
      return res.sendStatus(400);
    }
    res.status(201).send(newBlogger);
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const result = await bloggersService.deleteBloggerById(+req.params.id);
  if (!result) {
    return res.sendStatus(404);
  }
  if (result) {
    return res.sendStatus(204);
  }
});

export default router;
