"use server"
import { db } from "@/db";
import { accounts } from "@/db/schema";
import { eq } from "drizzle-orm";




export async function refreshAccessToken(refreshToken: string, userId: string) {
    try {
        const url = `https://oauth2.googleapis.com/token`;
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: process.env.AUTH_GOOGLE_CLIENT_ID!,
                client_secret: process.env.AUTH_GOOGLE_CLIENT_SECRET!,
                grant_type: "refresh_token",
                refresh_token: refreshToken,
            }),
        });

        // console.log(refreshToken)
        const refreshedTokens = await response.json();

        console.log(refreshedTokens)
        if (!response.ok) {
            throw new Error(refreshedTokens.error);
        }
        // Actualiza la base de datos con los nuevos tokens
        await db
            .update(accounts)
            .set({
                access_token: refreshedTokens.access_token,
                refresh_token: refreshedTokens.refresh_token ?? refreshToken,
                expires_at: Math.floor(Date.now() / 1000) + refreshedTokens.expires_in,
            })
            .where(eq(accounts.userId, userId))
            .execute();

        return {
            accessToken: refreshedTokens.access_token,
            expiresAt: Math.floor(Date.now() / 1000) + refreshedTokens.expires_in,
        };
    } catch (error) {
        console.error("Error refreshing access token:", error);
    }
}