import NextAuth from "next-auth";
import { authOptions } from "./options";

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }


/*
Note : [...nextauth] is a catch-all route in Next.js that handles all authentication-related requests for NextAuth.js. This includes routes for signing in, signing out, callback handling, session management, and more. By using a catch-all route, NextAuth.js can manage all these different endpoints under a single file, simplifying the routing structure and making it easier to maintain authentication logic in one place.
*/