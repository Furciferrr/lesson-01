import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import bloggersRouter from "./routes/bloggers";
import postsRouter from "./routes/posts";
import videosRouter from "./routes/videos";
import { runDb } from "./repositories/db-config";
import { authMiddleware } from "./middlewares/auth-middleware";

const app = express();
const port = 5000;


//app.use(authMiddleware)
app.use(cors());
app.use(bodyParser.json());

app.use("/bloggers", bloggersRouter);
app.use("/posts", postsRouter);
app.use("/videos", videosRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!!");
});

const startApp = async () => {
  await runDb();
  app.listen(process.env.PORT || port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

startApp();
