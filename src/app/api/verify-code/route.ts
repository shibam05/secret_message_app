import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { email, code } = await request.json();
        const decodedUsername = decodeURIComponent(email);
        const user = await userModel.findOne({ email: decodedUsername, verificationCode: code });

        if(!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                }, { status: 500 });
        }

        const isCodeValid = user.verifyCode === code;
        const isCodenotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if(isCodeValid && isCodenotExpired) {
            user.isVerified = true;
            await user.save();

            return Response.json(
                {
                    success: true,
                    message: "Account verified successfully"
                }, { status: 200 });
        } else if(!isCodenotExpired){
            return Response.json(
                {
                    success: true,
                    message: "verification Code has exported, try again to signup"
                }, { status: 400 });
        } else{
            return Response.json(
                {
                    success: true,
                    message: "Incorrect verification Code"
                }, { status: 400 });
        }

    } catch (error) {
        console.error("Error verifying code:", error);
        return Response.json(
            {
                success: false,
                message: "Error verifying code"
            }, { status: 500 });
    }
}