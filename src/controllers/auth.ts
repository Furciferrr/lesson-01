import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { LoginUserDto, UserDto } from "../dto";
import { IBodyValidator, IUserService } from "../interfaces";
import { TYPES } from "../IocTypes";

@injectable()
export class AuthController {
  constructor(
    @inject(TYPES.UserService)
    private readonly userService: IUserService,
    @inject(TYPES.BodyValidator)
    private readonly bodyValidator: IBodyValidator
  ) {}
  async login(req: Request, res: Response) {
    const conversionResult = await this.bodyValidator.validateAndConvert(
      LoginUserDto,
      req.body
    );
    if (conversionResult.error) {
      return res.status(400).send(conversionResult.error);
    }

    const checkResult = await this.userService.checkCredentials(
      req.body.login,
      req.body.password
    );
    if (checkResult.resultCode === 0) {
      res.status(200).send(checkResult);
    } else {
      res.sendStatus(401);
    }
  }
}
