"use client"
import { Trash2 } from 'lucide-react'
import React, { useState, useTransition } from 'react'
import { deleteTransaction } from "@/actions/transaction/deleteTransaction"

interface Props {
    id: string,
    date: string
}
const DeleteButton = ({ id, date }: Props) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}api/transaction`, {
                method: "DELETE",
                body: JSON.stringify({ id, date }),
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) throw new Error("Error al eliminar la transacción");

            console.log("Transacción eliminada correctamente");
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button className="bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-sm"
            onClick={handleDelete}
            disabled={isDeleting}
        >
            <Trash2 className={`w-4 text-gray-600 ${isDeleting ? "opacity-50" : ""}`} />
        </button>
    )
}

export default DeleteButton