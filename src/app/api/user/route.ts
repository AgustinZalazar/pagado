import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const newUser = await prisma.user.create({
            data: {
                name: body.name,
                lastname: body.lastname,
                phone: body.phone,
                email: body.email,
                sheetId: body.sheetId
            }
        })

        return Response.json(newUser, { status: 201 })
    } catch (error) {
        console.error("Error creatin user:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

}