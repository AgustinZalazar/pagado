import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [Google({
        clientId: process.env.AUTH_GOOGLE_CLIENT_ID!,
        clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET!,
        authorization: {
            params: {
                scope: "openid email profile https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets",
                access_type: "offline",
                prompt: "consent",
            },
        },
    })],
    callbacks: {
        authorized: ({ auth, request: { nextUrl } }) => {
            const isLoggedIn = !!auth?.user;
            const isOnProtectRoute = nextUrl.pathname.includes("/dashboard"); // just a example
            if (isOnProtectRoute) {
                if (isLoggedIn) return true;
                return Response.redirect(new URL("/login", nextUrl));
            } else if (isLoggedIn) {
                return Response.redirect(new URL("/dashboard", nextUrl));
            }
            return true;
        },
        async redirect({ url, baseUrl }) {
            if (url.startsWith("/")) return `${baseUrl}${url}`
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        },
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
            }
            return token;
        },
        async signIn({ account }) {
            if (account?.provider === "google" && account?.access_token) {
                try {
                    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/google-sheets`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ accessToken: account.access_token }),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        console.error("Error en el fetch a /api/sheets:", data);
                        return false;
                    }

                    console.log("Google Sheet gestionado exitosamente:", data);
                } catch (error) {
                    console.error("Error al realizar el fetch a /api/sheets:", error);
                    return false;
                }
            }
            if (account?.refresh_token) {
                // Guarda el refreshToken en la base de datos del usuario
                // await saveRefreshTokenToDatabase(user.id, account.refresh_token);
                // console.log(account.refresh_token)
            }
            return true;
        }
    },
    pages: {
        signIn: "login"
    }
})