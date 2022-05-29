import { IBloggerRepository } from './../interfaces';
import { MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { Blogger } from "../types";
import { BloggerRepository } from "./bloggers-repository";
import { bloggersCollection } from "./db-config";
import { ioc } from '../IocContainer';
import { TYPES } from '../IocTypes';

describe("bloggersRepository", () => {
  
  describe("getBloggers", () => {
    const bloggerRepository = ioc.get<IBloggerRepository>(TYPES.BloggerRepository);
	//let mongoServer: MongoMemoryServer;

    beforeAll(async () => {
      //mongoServer = await MongoMemoryServer.create();
     // const uri = mongoServer.getUri();
      //await mongoose.connect(uri);
      bloggersCollection.insertMany([
        {
          id: "1",
          name: "Vadim",
          youtubeUrl: "http://youtube.com",
        },
        {
          id: "2",
          name: "Semen",
          youtubeUrl: "http://youtube2.com",
        },
        {
          id: "3",
          name: "Peter",
          youtubeUrl: "http://youtube3.com",
        },
      ]);
    });

    afterAll(async () => {
      //await mongoose.connection.db.dropDatabase();
      //await mongoose.disconnect();
      //await mongoServer.stop();
    });

    it("should return blogger with id 3", async () => {
      const result = await bloggerRepository.getBloggerById("3");
      expect(result?.id).toBe("3");
    });
  });
});
