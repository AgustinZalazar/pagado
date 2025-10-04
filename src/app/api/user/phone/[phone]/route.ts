export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { accounts, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { m } from "motion/react";

const API_URL = process.env.NEXT_PUBLIC_NEXTAUTH_URL;

export async function GET(
    request: Request,
    { params }: { params: { phone: string } }
) {
    const { phone } = params;
    const session = await auth();

    // Validar token desde el header Authorization
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1]; // Espera formato: "Bearer <token>"

    const expectedToken = process.env.API_SECRET_TOKEN;

    if (!session) {
        if (!token || token !== expectedToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    }

    try {
        // Busca el usuario por email en la base de datos
        const userResult = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
        if (userResult.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const user = userResult[0];

        // 2. Buscar el accessToken en la tabla accounts usando user.id
        // const accountResult = await db
        //     .select()
        //     .from(accounts)
        //     .where(eq(accounts.userId, user.id))
        //     .limit(1);

        // const accessToken = accountResult[0]?.access_token ?? null;

        // const categoriesRes = await fetch(`${API_URL}api/category?mail=${user.email}`, {
        //     headers: {
        //         Authorization: `Bearer ${process.env.API_SECRET_TOKEN}`
        //     },
        // });
        // const categories = await categoriesRes.json();

        // const accounts = await fetch(`${API_URL}api/accounts?mail=${user.email}`, {
        //     headers: {
        //         Authorization: `Bearer ${process.env.API_SECRET_TOKEN}`
        //     },
        // });
        // console.log(accounts)
        // const accountsData = await accounts.json();

        // const methods = await fetch(`${API_URL}api/methods?mail=${user.email}`, {
        //     headers: {
        //         Authorization: `Bearer ${process.env.API_SECRET_TOKEN}`
        //     },
        // });

        // console.log(methods)
        // const methodsData = await methods.json();


        return NextResponse.json({ ...user });
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
