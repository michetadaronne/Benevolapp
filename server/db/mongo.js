import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function connectToDb() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB via Mongoose");
}
