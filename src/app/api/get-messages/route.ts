import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import mongoose from "mongoose";

export async function GET() {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return Response.json(
            { success: false, message: "Not Authenticated" },
            { status: 401 }
        );
    }

    const userId = new mongoose.Types.ObjectId(session.user._id);

    try {
        const user = await userModel.findById(userId).select("messages");

        if (!user) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // sort newest → oldest
        const sortedMessages = [...user.messages].sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );

        return Response.json(
            {
                success: true,
                messages: sortedMessages,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error getting messages", error);
        return Response.json(
            { success: false, message: "An unexpected error occurred" },
            { status: 500 }
        );
    }
}
