import mongoose from "mongoose";
import config from "config";

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
