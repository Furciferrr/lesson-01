import express, { Request, Response } from "express";
import { UserDto } from "../dto";
import { userService } from "../services/users-service";
import { validateAndConvert } from "../validator";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const conversionResult = await validateAndConvert(UserDto, req.body);
  if (conversionResult.error) {
    return res.status(400).send(conversionResult.error);
  }
  const checkResult = await userService.checkCredentials(
    req.body.username,
    req.body.password
  );
  if (checkResult.resultCode === 0) {
    res.status(201).send(checkResult);
  } else {
    res.sendStatus(401);
  }
});

export default router;
