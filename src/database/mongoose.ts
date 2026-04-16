import config from "config";
import mongoose, { mongo } from "mongoose";

const port = config.get<number>("server.port");

export async function connectDatabase(): Promise<void> {
  try {
    const mongoUri = config.get<string>("db.mongoUri");
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}
