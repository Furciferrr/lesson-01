import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import bloggersRouter from "./routes/bloggers"
import postsRouter from "./routes/posts"


const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/bloggers', bloggersRouter);
app.use('/posts', postsRouter);


app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!!");
});


app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening on port ${port}`);
});
