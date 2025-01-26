export const runtime = "nodejs"; // Configura el runtime a Node.js

import { db } from "@/db";
import { users } from "@/db/schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const [newUser] = await db
            .insert(users)
            .values({
                id: crypto.randomUUID(),
                name: body.name,
                phone: body.phone,
                email: body.email,
                sheetId: body.sheetId,
            })
            .$returningId();

        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
