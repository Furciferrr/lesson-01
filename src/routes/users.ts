import { userService } from "./../services/users-service";
import express, { Request, Response } from "express";
import { validateAndConvert } from "../validator";
import { UserDto } from "../dto";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const pageNumber = req.query.pageNumber as string;
  const pageSize = req.query.pageSize as string;
  const users = await userService.getUsers(+pageNumber, +pageSize);
});

router.post("/", async (req: Request, res: Response) => {
  const conversionResult = await validateAndConvert(UserDto, req.body);
  if (conversionResult.error) {
    return res.status(400).send(conversionResult.error);
  }
  const newUser = await userService.createUser(req.body);
  if(newUser) {
	res.status(201).send(newUser);
  } else {
	res.sendStatus(409)
  }
  
});

router.delete("/:id", async (req: Request, res: Response) => {});

export default router;
