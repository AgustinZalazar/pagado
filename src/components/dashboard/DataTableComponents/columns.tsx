"use client"
import { ColumnDef } from "@tanstack/react-table"
import { Trash2 } from "lucide-react"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Transaction } from "@/types/transaction"
import { EditDialogWindow } from "../incomes/dialogWindows/Edit"
import DeleteButton from "../buttons/deleteButton"

const getColumns = (locale: string): ColumnDef<Transaction>[] => {
    const formatCurrency = (value: number) =>
        new Intl.NumberFormat(locale, {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);

    return [
        {
            accessorKey: "id",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Numero
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                return <p className="px-4">{row.getValue("id")}</p>
            },
        },
        {
            accessorKey: "description",
            header: "Descripcion",
        },
        {
            accessorKey: "type",
            header: locale === "es" ? "Tipo" : "Type",
            cell: ({ row }) => {
                if (row.getValue("type") === "expense") {
                    return <p className="rounded-lg bg-[#f9cbca] text-red-400 px-2 py-1 text-center w-fit capitalize">{locale === "es" ? "Gasto" : "Expense"}</p>
                } else {
                    return <p className="rounded-lg bg-[#bce9d4e3] text-[#00b743] px-2 py-1 text-center w-fit capitalize">{locale === "es" ? "Ingreso" : "Income"}</p>
                }
            },
        },
        {
            accessorKey: "category",
            header: "Categoria",
        },
        {
            accessorKey: "amount",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="ml-auto"
                    >
                        Monto
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const rawAmount = row.getValue("amount");
                let amount: number;

                if (typeof rawAmount === "string") {
                    amount = parseFloat(rawAmount.replace(",", "."));
                } else if (typeof rawAmount === "number") {
                    amount = rawAmount;
                } else {
                    amount = 0; // fallback seguro
                }

                const formatted = formatCurrency(amount);
                if (row.getValue("type") === "expense") {
                    return (
                        <p className=" text-[#dc4a46] text-left font-bold">
                            -{formatted}
                        </p>
                    );
                } else {
                    return (
                        <p className=" text-[#008f4c] text-left font-bold ">
                            +{formatted}
                        </p>
                    );
                }
            },
        },
        {
            accessorKey: "date",
            header: "Fecha",
            cell: ({ row }) => {
                const date = new Date(row.getValue("date"));
                return (
                    <p>
                        {date.toLocaleDateString("es-ES")}
                    </p>
                )
            },
        },
        {
            accessorKey: "account",
            header: "Cuenta",
        },
        {
            accessorKey: "method",
            header: "Metodo de pago",
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const transaction = row.original
                return (
                    <div className="flex gap-4">
                        <EditDialogWindow transaction={transaction} />
                        <DeleteButton id={transaction.id} date={transaction.date} />
                    </div>
                )
            },
        },
    ]
};


export default getColumns