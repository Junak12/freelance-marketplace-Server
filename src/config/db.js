import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.vzxrz2j.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

await client.connect();

const db = client.db("myDB");

export const jobsCollection = db.collection("AllJobs");
export const usersCollection = db.collection("Users");
export const reviewsCollections = db.collection("reviws");
export const myTaskCollection = db.collection("MyCollection");