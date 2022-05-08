import { userService } from "./../services/users-service";
import express, { Request, Response } from "express";
import { validateAndConvert } from "../validator";
import { authBaseMiddleware } from "../middlewares/basic-middleware";
import { UserDto } from "../dto";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const pageNumber = req.query.pageNumber as string;
  const pageSize = req.query.pageSize as string;
  const users = await userService.getUsers(+pageNumber, +pageSize);
  res.send(users);
});

router.post("/", authBaseMiddleware, async (req: Request, res: Response) => {
  const conversionResult = await validateAndConvert(UserDto, req.body);
  if (conversionResult.error) {
    return res.status(400).send(conversionResult.error);
  }
  const newUser = await userService.createUser(req.body);
  if (newUser) {
    res.status(201).send(newUser);
  } else {
    res.sendStatus(409);
  }
});

router.delete("/:id", authBaseMiddleware, async (req: Request, res: Response) => {
  const isRemoved = await userService.deleteUserById(+req.params.id);
  if (!isRemoved) {
    return res.sendStatus(404);
  }

  if (isRemoved) {
    res.sendStatus(204);
  }
});

export default router;
