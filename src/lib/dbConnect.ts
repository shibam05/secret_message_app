import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to the database");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI as string || '', {})
        connection.isConnected = db.connections[0].readyState
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error);
        // Don't call process.exit(1) — it kills the entire Next.js dev server
        throw new Error("Failed to connect to database");
    }
}

export default dbConnect