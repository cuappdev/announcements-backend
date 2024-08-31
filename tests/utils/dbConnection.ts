import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongoServer: MongoMemoryServer;

/* Creates a connection to database. */
export const connectDB = async (): Promise<void> => {
  mongoServer = await MongoMemoryServer.create();
  const uri = await mongoServer.getUri();
  await mongoose.connect(uri);
};

/* Disconnects from database. */
export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  await mongoServer.stop();
};
