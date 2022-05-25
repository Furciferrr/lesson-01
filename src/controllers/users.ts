import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { UserDto } from "../dto";
import { IBodyValidator, IUserService } from "../interfaces";
import { TYPES } from "../IocTypes";

@injectable()
export class UserController {
  constructor(
    @inject(TYPES.UserService)
    private readonly userService: IUserService,
    @inject(TYPES.BodyValidator)
    private readonly bodyValidator: IBodyValidator
  ) {}
  async getUsers(req: Request, res: Response) {
    const pageNumber = req.query.PageNumber as string;
    const pageSize = req.query.PageSize as string;
    const users = await this.userService.getUsers(+pageNumber, +pageSize);
    res.send(users);
  }

  async createUser(req: Request, res: Response) {
    const conversionResult = await this.bodyValidator.validateAndConvert(
      UserDto,
      req.body
    );
    if (conversionResult.error) {
      return res.status(400).send(conversionResult.error);
    }
    const newUser = await this.userService.createUser(req.body);
    if (newUser) {
      res.status(201).send(newUser);
    } else {
      res.sendStatus(409);
    }
  }

  async deleteUserById(req: Request, res: Response) {
    const isRemoved = await this.userService.deleteUserById(req.params.id);
    if (!isRemoved) {
      return res.sendStatus(404);
    }
    if (isRemoved) {
      res.sendStatus(204);
    }
  }
}
