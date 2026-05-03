import userModel from "@/model/User";
import { getServerSession, User } from "next-auth";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../../auth/[...nextauth]/options";

interface RouteContext {
    params: {
        messageId: string;
    };
}

export async function DELETE(request: Request, context: RouteContext) {
    const messageId = context.params.messageId;
    await dbConnect();
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            }, { status: 401 }
        )
    }

    try {
        const updateResult = await userModel.updateOne(
            {_id: new mongoose.Types.ObjectId(user._id) },
            {$pull: { messages: { _id: new mongoose.Types.ObjectId(messageId) } } }
        )
        if (updateResult.modifiedCount == 0) {
            return Response.json(
                {
                    success: false,
                    message: "Message not found or already deleted"
                }, { status: 401 }
            )
        }
        return Response.json(
            {
                success: true,
                message: "Message deleted successfully"
            }, { status: 201 }
        )
    } catch (error) {
        console.error("Error deleting message:", error);
        return Response.json(
            {
                success: false,
                message: "Failed to delete message"
            }, { status: 500 }
        )
    }

}