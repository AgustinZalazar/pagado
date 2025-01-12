// next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

// Extiende la interfaz de usuario
declare module "next-auth" {
    interface Session {
        // Agrega el campo accessToken a la sesión
        accessToken?: string;
        user: {
            id: string;
            email: string;
            name: string;
            image: string;
        } & DefaultSession["user"];
    }

    interface JWT {
        // Agrega el campo accessToken al JWT
        accessToken?: string;
    }
}
