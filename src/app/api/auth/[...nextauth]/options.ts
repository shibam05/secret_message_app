import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import userModel, { User as MongooseUser } from "@/model/User";

// Narrowed shape for the object we return from `authorize` and receive in callbacks
type ReturnedUser = {
    _id?: { toString(): string } | string;
    id?: string;
    email?: string;
    username?: string;
    isVerified?: boolean;
    isAcceptingMessage?: boolean;
};

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "your-email@example.com" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    console.log('creds:', credentials);
                    return null;
                }
                await dbConnect();
                try {
                    const user: MongooseUser | null = await userModel.findOne({
                        $or: [
                            { email: credentials.email },
                            // { username: credentials.username }
                        ]
                    })
                    if (!user) {
                        throw new Error(`No user was found with this email ${credentials.email}`)
                    }
                    if (!user.isVerified) {
                        throw new Error("Please verify your account before login")
                    }
                    const isCorrectPass = await bcrypt.compare(credentials.password, user.password);
                    if (isCorrectPass) {
                        console.log('creds:', credentials);
                        return {
                            // Mongoose Document exposes `id` as a string, prefer that to avoid unknown _id typing
                            id: user.id,
                            _id: user.id,
                            email: user.email,
                            username: user.username,
                            isVerified: user.isVerified,
                            isAcceptingMessage: user.isAcceptingMessage
                            // ...add any other properties you need for the session/JWT

                        }
                    } else {
                        console.log('creds:', credentials);
                        throw new Error("Incorrect Password")
                    }
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        console.log('creds:', credentials);
                        throw new Error(error.message)
                    }
                    throw new Error(String(error))
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                const u = user as ReturnedUser;
                // prefer _id (from Mongo) but fall back to id if present
                token._id = u._id ? u._id.toString() : u.id;
                token.isVerified = u.isVerified;
                token.isAcceptingMessage = u.isAcceptingMessage;
                token.username = u.username;
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                // session.user = token.user;
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessage = token.isAcceptingMessage;
                session.user.username = token.username;
            }
            return session
        }
    },
    pages: {
        signIn: '/sign-in',
    },
    session: {
        strategy: 'jwt', // database or jwt
    },
    secret: process.env.NEXTAUTH_SECRET,
}