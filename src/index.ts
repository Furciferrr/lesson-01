import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { bloggers, posts } from "./data";
import { Blogger, BloggerBodyType } from "./types";

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const getRandomNumber = () => {
  return (Math.random() * Math.pow(36, 6)) | 0;
};

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!!");
});

app.post("/bloggers", (req: Request, res: Response) => {
  const newBlogger: Blogger = {
    id: getRandomNumber(),
    name: req.body.name,
    youtubeUrl: req.body.youtubeUrl,
    posts: [],
  };
  bloggers.push(newBlogger);
  res.status(201).send(newBlogger);
});

app.get("/bloggers", (req: Request, res: Response) => {
  res.send(bloggers);
});

app.get("/bloggers/:id", (req: Request, res: Response) => {
  const foundBlogger = bloggers.find(
    (blogger) => blogger.id === +req.params.id
  );
  if (!foundBlogger) {
    return res.status(404);
  }
  res.send(foundBlogger);
});

app.get("/posts", (req: Request, res: Response) => {
  res.send(posts);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
