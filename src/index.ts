import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import bloggersRouter from "./routes/bloggers";
import postsRouter from "./routes/posts";
import videosRouter from "./routes/videos";
import usersRoute from "./routes/users"
import authRoute from "./routes/auth"
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
app.use("/users", usersRoute);
app.use("/login", authRoute);





app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!!");
});


app.post("/", (req: Request, res: Response) => {
  const reqBody = req.body;

  res.send("Hello World!!");
});

const startApp = async () => {
  await runDb();
  app.listen(process.env.PORT || port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

startApp();
