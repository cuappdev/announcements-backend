import mongoose, { ConnectOptions } from "mongoose";

export const dbConnect = async () => {
  // Determine environment
  let uri = process.env.LOCAL_URI;
  if (process.env.NODE_ENV === "development") {
    uri = process.env.DEV_URI;
  } else if (process.env.NODE_ENV === "production") {
    uri = process.env.PROD_URI;
  }

  // Connect to MongoDB
  await mongoose.connect(uri!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions);
  console.log("✅ Connected to MongoDB");
};

export const dbDisconnect = async () => {
  await mongoose.disconnect();
  console.log("✅ Disconnected from MongoDB");
};
