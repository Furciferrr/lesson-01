import { RequestAttemptsRepository } from "./../repositories/requestsAttempts-repository";
import { NextFunction, Request, Response } from "express";
import { ioc } from "../IocContainer";
import { TYPES } from "../IocTypes";

const requestAttemptRepository = ioc.get<RequestAttemptsRepository>(
  TYPES.RequestAttemptRepository
);

export const securityCountAttemptsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getSeconds() - 10);

    const requests =
      await requestAttemptRepository.getRequestAttemptsBetweenToDates(
        req.ip,
        startDate,
        new Date()
      );

    if (requests.length >= 5) {
      res.status(429);
      return;
    } else {
      await requestAttemptRepository.createRequestAttempt({
        ip: req.ip,
        date: new Date(),
      });
	  
      next();
    }
  } catch (e) {
	console.error("request middleware", e);
    return res.sendStatus(429);
  }
};
