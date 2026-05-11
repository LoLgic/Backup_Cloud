import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB conectado ✅");
    console.log(`Host: ${connection.connection.host}`);

  } catch (error) {
    console.error("Error conectando MongoDB ❌", error);
    process.exit(1);
  }
};

export default connectDB;