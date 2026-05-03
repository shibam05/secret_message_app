import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import userModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";

export async function POST(request: Request) {
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

    const userId = user._id;
    const { acceptMessages } = await request.json()

    try {
        const updatedUser = await userModel.findByIdAndUpdate(userId,
            { isAcceptingMessage: acceptMessages },
            { new: true }
        );
        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "failed to update user status to accept messages"
                }, { status: 401 }
            )
        }
        return Response.json(
            {
                success: true,
                message: "User Message acceptance status updated successfully",
                updatedUser
            }
        )

    } catch (error) {
        console.error("failed to update user acceptMessages setting:", error);
        return Response.json(
            {
                success: false,
                message: "failed to update user status to accept messages"
            }, { status: 500 }
        )
    }

}

export async function GET() {
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
    const userId = user._id;
    try {
        const foundUser = await userModel.findById(userId);
        if (!foundUser) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                }, { status: 404 }
            )
        }

        return Response.json(
            {
                success: true,
                isAcceptingMessage: foundUser.isAcceptingMessage
            }, { status: 200 }
        )
    } catch (error) {
        console.error("Error fetching user message acceptance status:", error);
        return Response.json(
            {
                success: false,
                message: "Error fetching user message acceptance status"
            }, { status: 500 }
        )
    }
}