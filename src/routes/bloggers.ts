import { bloggersRepository } from "./../repositories/bloggers-repository";
import express, { Request, Response } from "express";
import { BloggerDto } from "../dto";
import { validateAndConvert } from "../validator";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  const bloggers = bloggersRepository.getBloggers();
  res.send(bloggers);
});

router.get("/:id", (req: Request, res: Response) => {
  const foundBlogger = bloggersRepository.deleteBloggerById(+req.params.id);

  if (!foundBlogger) {
    return res.status(404).send();
  }
  res.send(foundBlogger);
});

router.put("/:id", async (req: Request, res: Response) => {
  const conversionResult = await validateAndConvert(BloggerDto, req.body);
  if (conversionResult.error) {
    return res.status(400).send(conversionResult.error);
  }

  const newBlogger = bloggersRepository.updateBloggerById(
    +req.params.id,
    req.body
  );
  if (!newBlogger) {
    res.sendStatus(404);
  }

  res.sendStatus(201);
});

router.post("/", async (req: Request, res: Response) => {
  const conversionResult = await validateAndConvert(BloggerDto, req.body);
  if (conversionResult.error) {
    res.status(400).send(conversionResult.error);
  } else {
    const newBlogger = bloggersRepository.createBlogger(req.body);
    if (!newBlogger) {
      res.sendStatus(400);
    }
    res.status(201).send(newBlogger);
  }
});

router.delete("/:id", (req: Request, res: Response) => {
  const result = bloggersRepository.deleteBloggerById(+req.params.id);
  if (!result) {
    res.sendStatus(404);
  }
  if (result) {
    res.sendStatus(204);
  }
});

export default router;
