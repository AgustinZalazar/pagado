// auth.config.ts
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";
import { getDb } from "@/db";
import { users, accounts, sessions, verificationTokens } from "@/db/schema"
import { refreshAccessToken } from "@/actions/updateUserToken";
import { eq } from "drizzle-orm";

export const authConfig = async (): Promise<NextAuthConfig> => {
    const db = await getDb();

    return {
        adapter: DrizzleAdapter(db, {
            usersTable: users,
            accountsTable: accounts,
            sessionsTable: sessions,
            verificationTokensTable: verificationTokens,
        }),
        providers: [
            Google({
                clientId: process.env.AUTH_GOOGLE_CLIENT_ID!,
                clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET!,
                authorization: {
                    params: {
                        scope:
                            "openid email profile https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets",
                        access_type: "offline",
                        prompt: "consent",
                    },
                },
            }),
        ],
        session: {
            strategy: "database",
        },
        callbacks: {
            async redirect({ url, baseUrl }) {
                if (url === "/login") return `${baseUrl}/dashboard`;
                if (url.startsWith("/")) return `${baseUrl}${url}`;
                if (new URL(url).origin === baseUrl) return url;
                return baseUrl;
            },
            async session({ session, user }) {
                if (!user?.id) return session;

                const userAccount = await db
                    .select()
                    .from(accounts)
                    .where(eq(accounts.userId, user.id))
                    .limit(1)
                    .then((rows) => rows[0]);

                if (!userAccount) return session;

                session.accessToken = userAccount.access_token!;
                session.accessTokenExpires = userAccount.expires_at ? userAccount.expires_at * 1000 : undefined;
                session.refreshToken = userAccount.refresh_token!;

                const expiresAt = session.accessTokenExpires ?? 0;
                if (expiresAt && Date.now() > expiresAt) {
                    const newToken = await refreshAccessToken(session.refreshToken, session.user.id);
                    if (!newToken) return { ...session, error: "RefreshTokenError" };
                    return {
                        ...session,
                        accessToken: newToken.accessToken,
                        error: null,
                    };
                }

                return session;
            },
            async signIn({ account, profile }) {
                if (account?.provider === "google" && account?.access_token) {
                    try {
                        const userEmail = profile?.email;
                        const user = await fetch(`${process.env.NEXTAUTH_URL}api/user/${userEmail}`).then((res) => res.json());

                        if (!user || user?.error === "User not found") {
                            const response = await fetch(`${process.env.NEXTAUTH_URL}api/google-sheets`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ accessToken: account.access_token }),
                            });

                            const data = await response.json();

                            const responseConfig = await fetch(`${process.env.NEXTAUTH_URL}api/setup-sheet`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ accessToken: account.access_token, sheetId: data.id }),
                            });

                            if (!response.ok) return false;

                            const newUserResponse = await fetch(`${process.env.NEXTAUTH_URL}api/user`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    name: profile?.name,
                                    phone: "",
                                    email: userEmail,
                                    sheetId: data.id,
                                }),
                            });

                            if (!newUserResponse.ok) return false;
                        }
                    } catch (error) {
                        console.error("Error al gestionar el usuario y Google Sheets:", error);
                        return false;
                    }
                }
                return true;
            },
        },
        pages: {
            signIn: "login",
        },
    };
};
