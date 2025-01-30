"use server"

import { toast } from "@/components/hooks/use-toast";

export async function deleteTransaction(id: string, date: string): Promise<{ success: boolean; message?: string }> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/transaction`, {
            method: "DELETE",
            body: JSON.stringify({ id, date }),
            headers: { "Content-Type": "application/json" },
        });
        console.log(await res.json())
        if (!res.ok) throw new Error("Error al eliminar la transacción");

        return { success: true };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}