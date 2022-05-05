import { usersCollection } from "./db-config";
import { UserDBType, UserViewType } from "./../types";
import { UserDto } from "../dto";
import { getRandomNumber } from "../utils";

export const userRepository = {
  async getUsers(pageNumber = 1, pageSize = 10): Promise<UserViewType[]> {
    return usersCollection
      .find({}, { projection: { _id: 0, hashPassword: 0 } })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();
  },

  async getUserByLogin(login: string): Promise<UserDBType | null> {
    const user: UserDBType | null = await usersCollection.findOne(
      { login },
      { projection: { _id: 0 } }
    );
    if (!user) {
      return null;
    }
    return user;
  },

  async getUserById(id: number): Promise<UserDBType | null> {
    const user: UserDBType | null = await usersCollection.findOne(
      { id },
      { projection: { _id: 0 } }
    );
    if (!user) {
      return null;
    }
    return user;
  },

  async deleteUserById(id: number): Promise<boolean> {
    return true;
  },

  async createUser(user: UserDBType): Promise<UserViewType> {
    await usersCollection.insertOne(user, {
      forceServerObjectId: true,
    });
    const { id, login } = user;
    return { id, login };
  },
};
