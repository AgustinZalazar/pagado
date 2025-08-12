import { auth } from "@/auth"
import { phoneRegistrationSchema } from "@/lib/validations/phoneRegistration"
import { NextResponse } from "next/server"
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
    try {
        const session = await auth()
        const db = await getDb();
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        console.log(body)
        // const validatedData = phoneRegistrationSchema.parse(body)

        await db
            .update(users)
            .set({
                phone: body.phoneNumber,
                country: body.country,
                currency: body.currency,
            })
            .where(eq(users.id, session.user.id))

        return NextResponse.json({ message: "Phone number updated successfully" })
    } catch (error) {
        console.error("[PHONE_REGISTRATION_ERROR]", error)
        return new NextResponse(
            error instanceof Error ? error.message : "Internal Server Error",
            { status: 500 }
        )
    }
} 