import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { JWT_SECRET } from "../constants";
import { ioc } from "../IocContainer";
import { TYPES } from "../IocTypes";
import { UserService } from "../services/users-service";

const userService = ioc.get<UserService>(TYPES.UserService);

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.sendStatus(401);
  }
  try {
    const decode: any = verify(token, JWT_SECRET);
    const user = await userService.getUserById(decode.id);
    if (!user) {
      return res.sendStatus(401);
    }
    //@ts-ignore
    req.user = user;
  } catch (e) {
    return res.sendStatus(401);
  }

  next();
};
