import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {

            serverSelectionTimeoutMS: 30000,
            // Additional options can be added here if needed
        });
        console.log("MongoDB connected successfully!");
    } catch (err) {
        console.error(`Error happened: ${err.message}`);
        process.exit(1); // Exit the process with failure
    }
};

export default connectDB;
