"use client"
import React from "react"
import { DataTable } from '@/components/dashboard/incomes/DataTable'
import { useLocale } from "next-intl";
import getColumns from "../DataTableComponents/columns";
import { Transaction } from "@/types/transaction";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
    data: Transaction[]
    isLoading?: boolean
}

const TableSkeleton = () => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {Array.from({ length: 8 }).map((_, index) => (
                        <TableHead key={index}>
                            <Skeleton className="h-4 w-[100px]" />
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: 5 }).map((_, rowIndex) => (
                    <TableRow key={rowIndex}>
                        {Array.from({ length: 8 }).map((_, cellIndex) => (
                            <TableCell key={cellIndex}>
                                <Skeleton className="h-6 w-[100px]" />
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export function DataTableContainer({ data, isLoading = false }: Props) {
    const locale = useLocale()
    const columns = getColumns(locale)

    return (
        <div className="flex-1">
            {isLoading ? (
                <TableSkeleton />
            ) : (
                <DataTable columns={columns} data={data} />
            )}
        </div>
    )
}
