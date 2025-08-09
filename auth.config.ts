// auth.config.ts
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";
import { getDb } from "@/db";
import { users, accounts, sessions, verificationTokens } from "@/db/schema"
import { refreshAccessToken } from "@/actions/updateUserToken";
import { eq } from "drizzle-orm";

async function validateAndSetupGoogleSheets(accessToken: string, userEmail: string) {
    try {
        // First, check if user has available space
        const driveResponse = await fetch(`${process.env.NEXTAUTH_URL}api/drive/check-quota`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        const driveData = await driveResponse.json();
        if (!driveResponse.ok) {
            console.error('Drive quota check failed:', driveData.error);
            return { success: false, error: 'Failed to check drive quota' };
        }

        // Create the spreadsheet
        const createSheetResponse = await fetch(`${process.env.NEXTAUTH_URL}api/google-sheets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accessToken }),
        });

        if (!createSheetResponse.ok) {
            console.error('Failed to create spreadsheet');
            return { success: false, error: 'Failed to create spreadsheet' };
        }

        const data = await createSheetResponse.json();

        // Setup the sheet with initial data
        const setupResponse = await fetch(`${process.env.NEXTAUTH_URL}api/setup-sheet`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accessToken, sheetId: data.id }),
        });

        if (!setupResponse.ok) {
            console.error('Failed to setup spreadsheet');
            return { success: false, error: 'Failed to setup spreadsheet' };
        }

        return { success: true, sheetId: data.id };
    } catch (error) {
        console.error('Sheet setup error:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

async function validateExistingSheet(accessToken: string, sheetId: string | undefined) {
    try {

        if (!sheetId) {
            console.error('No sheet ID provided for validation');
            return { exists: false, isValid: false };
        }

        const validateResponse = await fetch(
            `${process.env.NEXTAUTH_URL}api/google-sheets/validate?sheetId=${sheetId}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log({ validateResponse: validateResponse })
        if (!validateResponse.ok) {
            console.error('Sheet validation request failed:', validateResponse.status);
            return { exists: false, isValid: false };
        }

        const validation = await validateResponse.json();
        return {
            exists: validation.exists === true,
            isValid: validation.isValid === true,
            needsSetup: validation.needsSetup === true
        };
    } catch (error) {
        console.error('Sheet validation error:', error);
        return { exists: false, isValid: false };
    }
}

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
                const allowedEmails = ["agusstiin.az@gmail.com"];

                if (!profile?.email || !allowedEmails.includes(profile.email)) {
                    // 🔁 Redirige al login con mensaje de error
                    return "/login?error=unauthorized_email";
                }
                if (account?.provider !== "google" || !account?.access_token || !profile?.email) {
                    return false;
                }
                console.log({ account: account })
                try {
                    // Check if user exists
                    const userResponse = await fetch(`${process.env.NEXTAUTH_URL}api/user/${profile.email}`, {
                        headers: {
                            'Authorization': `Bearer ${process.env.API_SECRET_TOKEN}`,
                        },
                    });
                    const userData = await userResponse.json();


                    if (!userData || userData?.error === "User not found") {
                        // New user - create sheets and user account
                        const sheetsSetup = await validateAndSetupGoogleSheets(account.access_token, profile.email);

                        if (!sheetsSetup.success) {
                            console.error('Failed to setup sheets:', sheetsSetup.error);
                            return false;
                        }

                        // Create new user
                        const newUserResponse = await fetch(`${process.env.NEXTAUTH_URL}api/user`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                name: profile.name,
                                phone: "",
                                email: profile.email,
                                sheetId: sheetsSetup.sheetId,
                            }),
                        });

                        if (!newUserResponse.ok) {
                            console.error('Failed to create user');
                            return false;
                        }

                        return true;
                    }

                    // Existing user - first check if they have a sheetId
                    if (!userData.sheetId) {
                        console.log('User exists but has no sheetId, creating new sheet...');
                        const sheetsSetup = await validateAndSetupGoogleSheets(account.access_token, profile.email);
                        if (!sheetsSetup.success) {
                            console.error('Failed to setup sheets for user without sheetId:', sheetsSetup.error);
                            return false;
                        }

                        // Update user with new sheet ID
                        const updateUserResponse = await fetch(`${process.env.NEXTAUTH_URL}api/user/${profile.email}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                sheetId: sheetsSetup.sheetId,
                            }),
                        });

                        if (!updateUserResponse.ok) {
                            console.error('Failed to update user with new sheet ID');
                            return false;
                        }
                    } else {
                        // User has a sheetId, validate it exists and is properly set up
                        const validation = await validateExistingSheet(account.access_token, userData.sheetId);
                        console.log({ validation: validation })
                        if (!validation.exists) {
                            console.log('Sheet does not exist, creating new one...');
                            const sheetsSetup = await validateAndSetupGoogleSheets(account.access_token, profile.email);

                            if (!sheetsSetup.success) {
                                console.error('Failed to setup replacement sheets:', sheetsSetup.error);
                                return false;
                            }

                            // Update user with new sheet ID
                            const updateUserResponse = await fetch(`${process.env.NEXTAUTH_URL}api/user/${profile.email}`, {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    sheetId: sheetsSetup.sheetId,
                                }),
                            });

                            if (!updateUserResponse.ok) {
                                console.error('Failed to update user with new sheet ID');
                                return false;
                            }
                        } else if (!validation.isValid) {
                            console.log('Sheet exists but needs setup...');
                            // Sheet exists but needs to be set up
                            const setupResponse = await fetch(`${process.env.NEXTAUTH_URL}api/setup-sheet`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    accessToken: account.access_token,
                                    sheetId: userData.sheetId
                                }),
                            });

                            if (!setupResponse.ok) {
                                console.error('Failed to setup existing sheet');
                                return false;
                            }
                        } else {
                            console.log('Sheet exists and is properly configured');
                        }
                    }

                    return true;
                } catch (error) {
                    console.error("Error in sign in process:", error);
                    return false;
                }
            },
        },
        pages: {
            signIn: "login",
        },
    };
};
