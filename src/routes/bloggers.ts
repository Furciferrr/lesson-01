import { bloggersRepository } from "./../repositories/bloggers-repository";
import express, { Request, Response } from "express";
import { BloggerDto, UpdateBloggerDto } from "../dto";
import { validateAndConvert } from "../validator";
import { Blogger } from "../types";
import { WithId } from "mongodb";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const bloggers = await bloggersRepository.getBloggers();
  
  res.send(bloggers);
});

router.get("/:id", async (req: Request, res: Response) => {
  const foundBlogger = await bloggersRepository.getBloggerById(+req.params.id);

  if (!foundBlogger) {
    return res.status(404).send();
  }
  res.send(foundBlogger);
});

router.put("/:id", async (req: Request, res: Response) => {
  if(!Object.keys(req.body).length) {
    return res.sendStatus(400)
  }
  const conversionResult = await validateAndConvert(UpdateBloggerDto, req.body);
  if (conversionResult.error) {
    return res.status(400).send(conversionResult.error);
  }

  const newBlogger = await bloggersRepository.updateBloggerById(
    +req.params.id,
    req.body
  );
  if (!newBlogger) {
    res.sendStatus(404);
  }

  res.sendStatus(204);
});

router.post("/", async (req: Request, res: Response) => {
  const conversionResult = await validateAndConvert(BloggerDto, req.body);
  if (conversionResult.error) {
    res.status(400).send(conversionResult.error);
  } else {
    const newBlogger = await bloggersRepository.createBlogger(req.body);
    if (!newBlogger) {
      res.sendStatus(400);
    }
    res.status(201).send(newBlogger);
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const result = await bloggersRepository.deleteBloggerById(+req.params.id);
  if (!result) {
    res.sendStatus(404);
  }
  if (result) {
    res.sendStatus(204);
  }
});

export default router;
