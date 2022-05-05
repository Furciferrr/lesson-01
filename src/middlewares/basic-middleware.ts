import { NextFunction, Request, Response } from "express";

export const authBaseMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.sendStatus(401);
  }
  try {
    const decode = Buffer.from(token, "base64").toString("ascii");
    const creds = decode.split(":");
    if (creds[0] !== "admin" || creds[1] !== "qwerty") {
      return res.sendStatus(401);
    }
  } catch (e) {
    return res.sendStatus(401);
  }

  next();
};
