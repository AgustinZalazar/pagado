"use client"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Payment } from "@/types/payment"

const getColumns = (locale: string): ColumnDef<Payment>[] => {
    const formatCurrency = (value: number) =>
        new Intl.NumberFormat(locale, {
            style: "currency",
            currency: "ARS",
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
                    // return <p className="rounded-lg bg-[#f5f5f5] text-red-400 px-2 py-1 text-center w-fit capitalize">{row.getValue("type")}</p>
                } else {
                    return <p className="rounded-lg bg-[#bce9d4e3] text-[#00b743] px-2 py-1 text-center w-fit capitalize">{locale === "es" ? "Ingreso" : "Income"}</p>
                    // return <p className="rounded-lg bg-[#f5f5f5] text-[#00b743] px-2 py-1 text-center w-fit capitalize">{row.getValue("type")}</p>
                }
            },
        },
        {
            accessorKey: "category",
            header: "Categoria",
        },
        {
            accessorKey: "amount",
            // header: () => <div className="text-right">Amount</div>,
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
                const amount = parseFloat(row.getValue("amount"));
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
            accessorKey: "typeOfPayment",
            header: "Metodo de pago",
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const payment = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuItem>Eliminar</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]
};


export default getColumns