import express, { Request, Response } from "express";
import { getRandomNumber } from "../utils";
import { posts } from "./../data";


const router = express.Router();

router.post("/", (req: Request, res: Response) => {});

router.get("/", (req: Request, res: Response) => {
  res.send(posts);
});

router.get("/:id", (req: Request, res: Response) => {});

export default router;
