import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
// import authConfig from "@/auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [Google],
    callbacks: {
        authorized: async ({ auth }) => {
            // Logged in users are authenticated, otherwise redirect to login page
            return !!auth
        },
        async redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        }
    },
    pages: {
        signIn: "login"
    }
})