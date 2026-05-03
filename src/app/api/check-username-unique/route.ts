import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation,
})

export async function GET(request: Request) {
    // not needed in page router neither in api routes
    // -->
    // if (request.method !== "GET") {
    //     return Response.json({
    //         success: false,
    //         message: "Method Not Allowed. Only GET requests are allowed.",
    //     }, { status: 405 })
    // }

    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const queryparams = { username: searchParams.get("username") };
        // Validate username using Zod schema
        const result = UsernameQuerySchema.safeParse(queryparams); // Wrap in object for Zod
        console.log("Validation result:", result); // just check, remove later

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json(
                {
                    success: false,
                    message: usernameErrors?.length > 0
                        ? usernameErrors.join(", ")
                        : "Invalid username format",
                    errors: result.error.errors, // Include validation errors
                },
                { status: 400 }
            );
        }

        const { username } = result.data;
        const existingVerifieUser = await userModel.findOne({ username, isVerified: true })
        if (existingVerifieUser) {
            return Response.json({
                success: false,
                message: "Username is already taken",
            }, { status: 409 });
        } else {
            return Response.json({
                success: true,
                message: "Username is available",
            }, { status: 200 });
        }
    } catch (error) {
        console.error("Error checking username uniqueness", error);
        return Response.json(
            {
                success: false,
                message: "Internal server error :: unable to check username uniqueness ",
            },
            { status: 500 }
        );
    }
}