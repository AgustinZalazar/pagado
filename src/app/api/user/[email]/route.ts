export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { accounts, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
    request: Request,
    { params }: { params: { email: string } }
) {
    const { email } = params;

    // Validar token desde el header Authorization
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1]; // Espera formato: "Bearer <token>"

    const expectedToken = process.env.API_SECRET_TOKEN;

    if (!token || token !== expectedToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Busca el usuario por email en la base de datos
        const db = await getDb();
        const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (userResult.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const user = userResult[0];

        // 2. Buscar el accessToken en la tabla accounts usando user.id
        const accountResult = await db
            .select()
            .from(accounts)
            .where(eq(accounts.userId, user.id))
            .limit(1);

        const accessToken = accountResult[0]?.access_token ?? null;

        return NextResponse.json({ ...user, accessToken });
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { email: string } }
) {
    const { email } = params;

    try {
        const db = await getDb();
        const { sheetId } = await request.json();

        if (!sheetId) {
            return NextResponse.json({ error: "Sheet ID is required" }, { status: 400 });
        }

        // Find user first
        const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (userResult.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Update user's sheetId
        await db
            .update(users)
            .set({ sheetId })
            .where(eq(users.email, email));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
