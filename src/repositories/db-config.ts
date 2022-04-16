import { MongoClient } from "mongodb";
import { Blogger, Post, VideoType } from "../types";

const url =
  "mongodb+srv://vadim:%25HXc-bM8Hn3Y5H%2A@cluster0.z2cpp.mongodb.net/bloggers?retryWrites=true&w=majority";

const client = new MongoClient(url);

const dbName = "bloggers";

export const bloggersCollection = client
  .db("bloggers")
  .collection<Blogger>("bloggers");

export const postsCollection = client.db("bloggers").collection<Post>("posts");
export const videosCollection = client.db("bloggers").collection<VideoType>("videos");

export async function runDb() {
  try {
    // Use connect method to connect to the server
    await client.connect();
    await client.db(dbName).command({ ping: 1 });
    console.log("Connected successfully to server");
  } catch (e) {
    console.log("Connected DB error:", e);
    await client.close();
  }
}
