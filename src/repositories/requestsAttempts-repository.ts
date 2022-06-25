import { CommentDBType, RequestAttemptType } from "../types";
import { CommentDto } from "../dto";
import { commentsCollection, requestAttemptsCollection } from "./db-config";
import { IRequestAttemptsRepository } from "../interfaces";
import { injectable } from "inversify";

@injectable()
export class RequestAttemptsRepository implements IRequestAttemptsRepository {
  async getRequestAttemptsBetweenToDates(
    ip: string,
    startDate: Date,
    endDate: Date
  ): Promise<Array<RequestAttemptType>> {
    const result = await requestAttemptsCollection
      .find({ ip, date: { $gte: startDate, $lte: endDate } })
      .select(["-_id", "-__v"])
      .lean();
    return result;
  }

  async createRequestAttempt(requestAttempt: RequestAttemptType): Promise<boolean> {
    const result = await requestAttemptsCollection.create(requestAttempt);
    return !!result
  }
}
