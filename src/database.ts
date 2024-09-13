import mongoose from "mongoose";

export const dbConnect = async () => {
  // Determine environment
  let uri = process.env.DEV_URI;
  if (process.env.NODE_ENV === "prod") {
    uri = process.env.PROD_URI;
  }

  // Connect to MongoDB
  await mongoose.connect(uri!);
  console.log("✅ Connected to MongoDB");
};

export const dbDisconnect = async () => {
  await mongoose.disconnect();
  console.log("✅ Disconnected from MongoDB");
};
