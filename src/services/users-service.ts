import { sign, verify } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserViewType } from "./../types";
import { UserDto } from "../dto";
import { userRepository } from "../repositories/users-repository";
import { getRandomNumber } from "../utils";
import { JWT_SECRET } from "../constants";

export const userService = {
  async getUsers(
    pageNumber?: number,
    pageSize?: number
  ): Promise<UserViewType[]> {
    return userRepository.getUsers(pageNumber, pageSize);
  },

  async deleteUserById(id: number): Promise<boolean> {
    return true;
  },

  async getUserById(id: number): Promise<UserViewType | null> {
    const user = await userRepository.getUserById(id);
    if (!user) {
      return null;
    }
    return { login: user.login, id: user.id };
  },

  async createUser(user: UserDto): Promise<UserViewType | null> {
    const isUserExist = await userRepository.getUserByLogin(user.username);
    if (isUserExist) {
      return null;
    }
    const hashPassword = await this._generateHash(user.password);
    const newUser = {
      id: getRandomNumber(),
      login: user.username,
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
