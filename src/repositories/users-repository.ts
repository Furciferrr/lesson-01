import { usersCollection } from "./db-config";
import { UserDBType, UserViewType } from "./../types";
import { IUserRepository } from "../interfaces";
import { injectable } from "inversify";

@injectable()
export class UserRepository implements IUserRepository {
  async getUsers(pageNumber = 1, pageSize = 10): Promise<UserViewType[]> {
    return usersCollection
      .find({})
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .select(["-_id", "-hashPassword", "-__v"]);
  }

  async getTotalCount(): Promise<number> {
    return await usersCollection.countDocuments();
  }

  async getUserByLogin(login: string): Promise<UserDBType | null> {
    const user: UserDBType | null = await usersCollection
      .findOne({ login })
      .select(["-_id", "-__v"]);;
    if (!user) {
      return null;
    }
    return user;
  }

  async getUserById(id: string): Promise<UserDBType | null> {
    const user: UserDBType | null = await usersCollection
      .findOne({ id })
      .select(["-_id", "-__v"]);;
    if (!user) {
      return null;
    }
    return user;
  }

  async deleteUserById(id: string): Promise<boolean> {
    const result = await usersCollection.deleteOne({ id });
    return result.deletedCount === 1;
  }

  async createUser(user: UserDBType): Promise<UserViewType> {
    await usersCollection.create(user);
    const { id, login } = user;
    return { id, login };
  }
}
