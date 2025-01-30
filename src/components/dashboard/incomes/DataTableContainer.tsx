"use client"
import React from "react"
import { DataTable } from '@/components/dashboard/incomes/DataTable'
import { useLocale } from "next-intl";
import getColumns from "../DataTableComponents/columns";
import { Payment } from "@/types/payment";

interface Props {
    data: Payment[]
}

export function DataTableContainer({ data }: Props) {
    const locale = useLocale()
    const columns = getColumns(locale)

    return <DataTable columns={columns} data={data} />
}
