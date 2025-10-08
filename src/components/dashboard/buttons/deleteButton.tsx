"use client"
import { Trash2 } from 'lucide-react'
import React from 'react'
import { useDeleteTransaction } from '@/hooks/useGetTransactions'

interface Props {
    id: string,
    date: string
}
const DeleteButton = ({ id, date }: Props) => {
    const { deleteTransaction, isLoadingDelete } = useDeleteTransaction();

    const handleDelete = () => {
        deleteTransaction({ id, date });
    };

    return (
        <button
            className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-2 py-1 rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleDelete}
            disabled={isLoadingDelete}
            title="Eliminar transacción"
        >
            <Trash2 className={`w-4 text-gray-600 dark:text-gray-400 ${isLoadingDelete ? "animate-pulse" : ""}`} />
        </button>
    )
}

export default DeleteButton