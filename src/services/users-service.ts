import { sign } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { ResponseType, UserViewType } from "./../types";
import { UserDto } from "../dto";
import { getRandomNumber } from "../utils";
import { JWT_SECRET } from "../constants";
import { IMailSender, IUserRepository, IUserService } from "../interfaces";
import { inject, injectable } from "inversify";
import { TYPES } from "../IocTypes";
import add from "date-fns/add";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: IUserRepository,
    @inject(TYPES.EmailAdapter)
    private readonly mailSender: IMailSender
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
    return {
      login: user.login,
      id: user.id,
      email: user.email,
    };
  }

  async getUserByLoginOrEmail(
    login: string,
    email: string
  ): Promise<UserViewType | null> {
    const user = await this.userRepository.getUserByLoginOrEmail(login, email);
    if (!user) {
      return null;
    }
    return {
      login: user.login,
      id: user.id,
      email: user.email,
    };
  }

  async createUser(user: UserDto): Promise<UserViewType | null> {
    const isUserExist = await this.userRepository.getUserByLoginOrEmail(
      user.login,
      user.email
    );
    if (isUserExist) {
      return null;
    }
    const hashPassword = await this._generateHash(user.password);
    const newUser = {
      id: getRandomNumber().toString(),
      login: user.login,
      email: user.email,
      hashPassword,
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), { hours: 1, minutes: 2 }),
        isConfirmed: false,
      },
    };
    const result = await this.userRepository.createUser(newUser);

    try {
      await this.mailSender.sendEmail(
        user.email,
        `code=${newUser.emailConfirmation.confirmationCode}`
      );
    } catch (error) {
      console.error("service", error);
      await this.userRepository.deleteUserById(newUser.id);
      return null;
    }

    return result;
  }

  async confirmEmail(code: string): Promise<boolean> {
    const user = await this.userRepository.getUserByConfirmationCode(code);
    if (!user) {
      return false;
    }
    if (user.emailConfirmation.isConfirmed) {
      return false;
    }

    if (user.emailConfirmation?.expirationDate > new Date()) {
      const result = await this.userRepository.updateUserById({
        id: user.id,
        emailConfirmation: {
          confirmationCode: code,
          isConfirmed: true,
          expirationDate: user.emailConfirmation.expirationDate,
        },
      });
      console.log(result)
      return result;
    } else {
      return false;
    }
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
    if (!user.emailConfirmation.isConfirmed) {
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

  private generateJwt(user: any): string {
    return sign(
      {
        id: user.id,
      },
      JWT_SECRET
    );
  }
  private async _generateHash(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }
}
