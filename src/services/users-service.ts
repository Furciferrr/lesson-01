import { sign, verify } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ResponseType, UserViewType } from "./../types";
import { UserDto } from "../dto";
import { userRepository } from "../repositories/users-repository";
import { getRandomNumber } from "../utils";
import { JWT_SECRET } from "../constants";

export const userService = {
  async getUsers(
    pageNumber?: number,
    pageSize?: number
  ): Promise<ResponseType<UserViewType>> {
    const users = await userRepository.getUsers(
      pageNumber || 1,
      pageSize || 10
    );
    const totalCount = await userRepository.getTotalCount();
    const pagesCount = Math.ceil(totalCount / (pageSize || 10));
    const buildResponse = {
      pagesCount,
      page: pageNumber || 1,
      pageSize: pageSize || 10,
      totalCount,
      items: users,
    };

    return buildResponse;
  },

  async deleteUserById(id: number): Promise<boolean> {
    return await userRepository.deleteUserById(id);
  },

  async getUserById(id: number): Promise<UserViewType | null> {
    const user = await userRepository.getUserById(id);
    if (!user) {
      return null;
    }
    return { login: user.login, id: user.id };
  },

  async createUser(user: UserDto): Promise<UserViewType | null> {
    const isUserExist = await userRepository.getUserByLogin(user.login);
    if (isUserExist) {
      return null;
    }
    const hashPassword = await this._generateHash(user.password);
    const newUser = {
      id: getRandomNumber(),
      login: user.login,
      hashPassword,
    };
    const result = await userRepository.createUser(newUser);
    return result;
  },
  generateJwt(user: any): string {
    return sign(
      {
        id: user.id,
      },
      JWT_SECRET
    );
  },
  async checkCredentials(
    login: string,
    password: string
  ): Promise<{ resultCode: number; data: { token?: string | null } }> {
    const user = await userRepository.getUserByLogin(login);
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
  },
  async _generateHash(password: string) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  },
};
