// next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt"

// Extiende la interfaz de usuario
declare module "next-auth" {
    interface Session {
        accessToken?: string;
        refreshToken?: string;
        accessTokenExpires?: number;
        error: string;
        user: {
            id: string;
            email: string;
            name: string;
            image: string;
        } & DefaultSession["user"];
    }


}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
        refreshToken?: string;
    }
}
