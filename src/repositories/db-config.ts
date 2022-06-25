import { UserDBType, CommentDBType } from "./../types";
import { MongoClient } from "mongodb";
import { Blogger, Post, VideoType } from "../types";
import mongoose from "mongoose";
import {
  BloggerScheme,
  CommentScheme,
  PostScheme,
  RequestAttemptScheme,
  UserScheme,
  VideoScheme,
} from "./schemes";

const url =
  "mongodb+srv://vadim:%25HXc-bM8Hn3Y5H%2A@cluster0.z2cpp.mongodb.net/bloggers?retryWrites=true&w=majority";

export const bloggersCollection = mongoose.model("Bloggers", BloggerScheme);
export const postsCollection = mongoose.model("Posts", PostScheme);
export const videosCollection = mongoose.model("Videos", VideoScheme);
export const usersCollection = mongoose.model("Users", UserScheme);
export const commentsCollection = mongoose.model("Comments", CommentScheme);
export const requestAttemptsCollection = mongoose.model("RequestAttempts", RequestAttemptScheme);

//const client = new MongoClient(url);
//const dbName = "bloggers";

/* export const bloggersCollection = client
  .db("bloggers")
  .collection<Blogger>("bloggers");

export const postsCollection = client.db("bloggers").collection<Post>("posts");
export const videosCollection = client.db("bloggers").collection<VideoType>("videos");
export const usersCollection = client.db("bloggers").collection<UserDBType>("users");
export const commentsCollection = client.db("bloggers").collection<CommentDBType>("comments"); */

export async function runDb() {
  try {
    // Use connect method to connect to the server
    // await client.connect();
    //await client.db(dbName).command({ ping: 1 });
    await mongoose.connect(url);
    console.log("Connected successfully to DB server");
  } catch (e) {
    console.log("Connected DB error:", e);
    ///await client.close();
    await mongoose.disconnect();
  }
}
