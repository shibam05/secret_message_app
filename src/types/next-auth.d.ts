// import "next-auth";
// import { DefaultSession } from "next-auth";

// declare module 'next-auth' {
//     interface User {
//         _id: string;

//         // useful for token
//         username?: string;
//         email?: string;
//         isVerified?: boolean;
//         isAcceptingMessage?: boolean;
//     }
//     interface Session extends DefaultSession {
//         user: User & DefaultSession['user'];
//     }
// }

// declare module "next-auth/jwt" {
//     interface JWT {
//         user: {
//             _id: string;
//             username: string;
//             email: string;
//             isVerified: boolean;
//             isAcceptingMessage: boolean;
//         };
//     }
// }

import "next-auth";
import { DefaultSession } from 'next-auth';

declare module "next-auth" {
    interface User {
        _id?: string;
        username?: string;
        email?: string;
        isVerified?: boolean;
        isAcceptingMessage?: boolean;
    }

    interface Session {
        user: {
            _id?: string;
            isVerified?: boolean;
            isAcceptingMessage?: boolean;
            username?: string;
        } & DefaultSession['user'];
    }
}

declare module "next-auth/jwt" {
    // Flatten this interface
    interface JWT {
        _id?: string;
        username?: string;
        // email?: string;
        isVerified?: boolean;
        isAcceptingMessage?: boolean;
    }
}
