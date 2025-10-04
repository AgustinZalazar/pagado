"use server"
import { db } from "@/db";
import { accounts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { refreshAccessToken } from "@/actions/updateUserToken";

/**
 * Gets a valid Google access token for a user, refreshing it if necessary
 * @param userId - The user's ID
 * @returns A valid access token
 * @throws Error if account not found or token refresh fails
 */
export async function getValidGoogleAuth(userId: string): Promise<string> {
    const account = await db.select()
        .from(accounts)
        .where(eq(accounts.userId, userId))
        .limit(1)
        .then(rows => rows[0]);

    if (!account) {
        throw new Error('Account not found');
    }

    if (!account.access_token) {
        throw new Error('Access token not found');
    }

    // Check if token is expired
    const expiresAt = account.expires_at ? account.expires_at * 1000 : 0;

    if (Date.now() > expiresAt) {
        if (!account.refresh_token) {
            throw new Error('Token expired and no refresh token available');
        }

        const refreshed = await refreshAccessToken(account.refresh_token, userId);

        if (!refreshed) {
            throw new Error('Failed to refresh token');
        }

        return refreshed.accessToken;
    }

    return account.access_token;
}
