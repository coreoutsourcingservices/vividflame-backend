import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();

export const connectDB = async () => {
  try {
    const url=process.env.MONGO_URI
    console.log(url)
    const conn = await mongoose.connect(url);
    console.log(`✅ MongoDB Atlas connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};