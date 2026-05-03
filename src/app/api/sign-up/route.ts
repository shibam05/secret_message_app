import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import bcrypt from "bcryptjs"
// import { date, success } from "zod/v4";

// TODO: check

export async function POST(request: Request) {
    await dbConnect()

    try {
        // JSON request, not a form submission -->
        // const { username, email, password } = await request.json()

        let body = null;
        try {
            body = await request.json();
        } catch (e) {
            // request is not JSON
            console.error("Invalid JSON in request body", e);
            return Response.json(
                {
                    success: false,
                    message: "Invalid JSON in request body",
                },
                { status: 400 }
            );
        }

        const username = body?.username;
        const email = body?.email;
        const password = body?.password;

        // ✅ Validate inputs
        if (!username || !email || !password) {
            return Response.json(
                {
                    success: false,
                    message: "Missing required fields: username, email, password",
                },
                { status: 400 }
            );
        }

        // Safe email format check (optional)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return Response.json(
                {
                    success: false,
                    message: "Invalid email format",
                },
                { status: 400 }
            );
        }

        const existingUserVerifiedByUsername = await userModel.findOne({
            username,
            isVerified: true
        })

        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "username is already taken"
            }, { status: 400 })
        }

        /////////////////
        const existingUserByEmail = await userModel.findOne({ email })
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();


        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: 'User already exists with this email',
                    },
                    { status: 400 }
                )
            }
            else {
                const hashedpassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedpassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(
                    Date.now() + 3600000
                )
                await existingUserByEmail.save()
            }
        } else {
            const hashedpassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)
            const newUser = new userModel({
                username,
                email,
                password: hashedpassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })

            await newUser.save()
        }
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, { status: 500 })
        }

        console.log("User registered successfully")
        return Response.json({
            success: true,
            message: "User registered successfully. Now verify your email"
        }, { status: 201 })

    } catch (error) {
        console.error("Error registering user", error);
        return Response.json(
            {
                success: false,
                message: " Error registering the user"
            }, { status: 500 }
        )
    }
}