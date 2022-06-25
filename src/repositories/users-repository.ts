import { usersCollection } from "./db-config";
import { UserDBType, UserViewType } from "./../types";
import { IUserRepository } from "../interfaces";
import { injectable } from "inversify";

@injectable()
export class UserRepository implements IUserRepository {
  async getUsers(pageNumber = 1, pageSize = 10): Promise<UserViewType[]> {
    return usersCollection
      .find({"emailConfirmation.isConfirmed": true})
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .select(["-_id", "-hashPassword", "-__v", "-emailConfirmation"]);
  }

  async getTotalCount(): Promise<number> {
    return await usersCollection.countDocuments();
  }

  async getUserByLogin(login: string): Promise<UserDBType | null> {
    const user: UserDBType | null = await usersCollection
      .findOne({ login })
      .select(["-_id", "-__v"]);
    if (!user) {
      return null;
    }
    return user;
  }

  async getUserByLoginOrEmail(
    login: string,
    email: string
  ): Promise<UserDBType | null> {
    const user: UserDBType | null = await usersCollection
      .findOne({ $or: [{ login: login }, { email: email }] })
      .select(["-_id", "-__v"]);
    if (!user) {
      return null;
    }
    return user;
  }

  async updateUserById(
    user: Partial<UserDBType> & { id: string }
  ): Promise<boolean> {
    const { id } = user;
    const updatedUser = await usersCollection.updateOne({ id }, { $set: user });
    return updatedUser.modifiedCount === 1;
  }

  async getUserByConfirmationCode(
    confirmationCode: string
  ): Promise<UserDBType | null> {
    const user: UserDBType | null = await usersCollection
      .findOne({ "emailConfirmation.confirmationCode": confirmationCode })
      .select(["-_id", "-__v"]);
    if (!user) {
      return null;
    }
    return user;
  }

  async getUserById(id: string): Promise<UserDBType | null> {
    const user: UserDBType | null = await usersCollection
      .findOne({ id })
      .select(["-_id", "-__v"]);
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
    const { id, login, email } = user;
    return { id, login, email };
  }
}
