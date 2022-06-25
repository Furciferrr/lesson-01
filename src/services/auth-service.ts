import { IAuthService, IUserRepository } from "../interfaces";
import { inject, injectable } from "inversify";
import { TYPES } from "../IocTypes";
import { UserDto } from "../dto";
import { UserViewType } from "../types";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: IUserRepository
  ) {}

  async createUser(user: UserDto): Promise<UserViewType | null> {
    return "" as any;
  }
}
