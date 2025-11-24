import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);
let db;

export async function connectToDb() {
  await client.connect();
  db = client.db(); // prendra la DB du chemin dans MONGO_URI
  console.log("Connected to MongoDB Atlas");
}

export function getDb() {
  if (!db) {
    throw new Error("Database not initialized. Call connectToDb() first.");
  }
  return db;
}
