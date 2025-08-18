import "server-only";
import { auth } from "@/auth";
import { db } from "@/db";
import { accounts, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cache } from "react";

export const getUserByMail = cache(async (email: string) => {
    try {
        console.log("test cache user")
        // Busca el usuario por email en la base de datos
        const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (userResult.length === 0) {
            throw new Error("Usuario no encontrado");
        }
        const user = userResult[0];

        // 2. Buscar el accessToken en la tabla accounts usando user.id
        const accountResult = await db
            .select()
            .from(accounts)
            .where(eq(accounts.userId, user.id))
            .limit(1);

        const accessToken = accountResult[0]?.access_token ?? null;

        return { ...user, accessToken };
    } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error(`Error fetching user:${error}`);
    }
})