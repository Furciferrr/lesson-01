import { sign } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ResponseType, UserViewType } from "./../types";
import { UserDto } from "../dto";
import { getRandomNumber } from "../utils";
import { JWT_SECRET } from "../constants";
import { IUserRepository, IUserService } from "../interfaces";
import { inject, injectable } from "inversify";
import { TYPES } from "../IocTypes";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: IUserRepository
  ) {}
  async getUsers(
    pageNumber?: number,
    pageSize?: number
  ): Promise<ResponseType<UserViewType>> {
    const users = await this.userRepository.getUsers(
      pageNumber || 1,
      pageSize || 10
    );
    const totalCount = await this.userRepository.getTotalCount();
    const pagesCount = Math.ceil(totalCount / (pageSize || 10));
    const buildResponse = {
      pagesCount,
      page: pageNumber || 1,
      pageSize: pageSize || 10,
      totalCount,
      items: users,
    };

    return buildResponse;
  }

  async deleteUserById(id: string): Promise<boolean> {
    return await this.userRepository.deleteUserById(id);
  }

  async getUserById(id: string): Promise<UserViewType | null> {
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      return null;
    }
    return { login: user.login, id: user.id };
  }

  async createUser(user: UserDto): Promise<UserViewType | null> {
    const isUserExist = await this.userRepository.getUserByLogin(user.login);
    if (isUserExist) {
      return null;
    }
    const hashPassword = await this._generateHash(user.password);
    const newUser = {
      id: getRandomNumber().toString(),
      login: user.login,
      hashPassword,
    };
    const result = await this.userRepository.createUser(newUser);
    return result;
  }
  private generateJwt(user: any): string {
    return sign(
      {
        id: user.id,
      },
      JWT_SECRET
    );
  }
  async checkCredentials(
    login: string,
    password: string
  ): Promise<{ resultCode: number; data: { token?: string | null } }> {
    const user = await this.userRepository.getUserByLogin(login);
    if (!user) {
      return {
        resultCode: 1,
        data: {},
      };
    }

    const resultCompare = await bcrypt.compare(password, user.hashPassword);

    const token = this.generateJwt(user);
    return {
      resultCode: resultCompare ? 0 : 1,
      data: {
        token: resultCompare ? token : null,
      },
    };
  }
  private async _generateHash(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }
}
