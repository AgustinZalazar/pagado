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




export const columns: ColumnDef<Payment>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Number
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
        header: "Description",
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
            if (row.getValue("type") === "expense") {
                return <p className="rounded-full bg-[#dc4a46] text-white px-4 py-1 text-center w-fit capitalize">{row.getValue("type")}</p>
            } else {
                return <p className="rounded-full bg-[#008f4c] text-white px-4 py-1 text-center w-fit capitalize">{row.getValue("type")}</p>
            }
        },
    },
    {
        accessorKey: "category",
        header: "Category",
    },
    {
        accessorKey: "amount",
        header: () => <div className="text-right">Amount</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amount"))
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount)
            if (row.getValue("type") === "expense") {
                return <p className=" text-[#dc4a46] text-right font-bold">-{formatted}</p>
            } else {
                return <p className=" text-[#008f4c] text-right font-bold ">+{formatted}</p>
            }
        },
    },
    {
        accessorKey: "date",
        header: "Date",
    },
    {
        accessorKey: "typeOfPayment",
        header: "Type of Payment",
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
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(payment.id)}
                        >
                            Copy payment ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View customer</DropdownMenuItem>
                        <DropdownMenuItem>View payment details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
