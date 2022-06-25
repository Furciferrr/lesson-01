import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { ConfirmEmailDto, LoginUserDto, UserDto } from "../dto";
import { IAuthService, IBodyValidator, IUserService } from "../interfaces";
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
      res.status(200).send({ token: checkResult.data.token });
    } else {
      res.sendStatus(401);
    }
  }

  async registration(req: Request, res: Response) {
    const conversionResult = await this.bodyValidator.validateAndConvert(
      UserDto,
      req.body
    );
    if (conversionResult.error) {
      return res.status(400).send(conversionResult.error);
    }
    const result = await this.userService.createUser(req.body);

    if (result) {
      return res.status(204).send();
    } else {
      return res.status(400).send();
    }
  }

  async confirmation(req: Request, res: Response) {
    const conversionResult = await this.bodyValidator.validateAndConvert(
      ConfirmEmailDto,
      req.body
    );
    if (conversionResult.error) {
      return res.status(400).send(conversionResult.error);
    }
    const result = await this.userService.confirmEmail(req.body.code);
    if (result) {
      return res.status(204).send();
    } else {
      return res.status(400).send();
    }
  }

  async resendingEmail(req: Request, res: Response) {}
}
