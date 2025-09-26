"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaginationTable } from "../DataTableComponents/pagination";
import { NewTransactionWindow } from "./dialogWindows/newTransactionWindow";
import { FilterSheetWindow } from "./filtersSheetWindow";
import { Input } from "../../ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { getMonthName } from "@/helpers/getMonthName";
import { useTranslations } from "next-intl";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const router = useRouter();
    const t = useTranslations('Dashboard.Incomes');
    const searchParams = useSearchParams();
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Items per page
    const [sorting, setSorting] = React.useState<SortingState>([
        { id: "date", desc: true }
    ])

    // Update filters and page from query params
    useEffect(() => {
        const params: Record<string, string> = {};
        searchParams.forEach((value, key) => {
            params[key] = value;
        });
        setFilters(params);
        const page = parseInt(searchParams.get("page") || "1", 5);
        setCurrentPage(page);
    }, [searchParams]);

    const filteredData = useMemo(() => {
        const base = data.filter((item: any) => {
            const matchesType = !filters.type || filters.type === "all" || item.type === filters.type;
            const matchesCategory = !filters.category || filters.category === "all" || item.category === filters.category;
            const matchesTypePayment = !filters.paymentType || filters.paymentType === "all" || item.typeOfPayment === filters.paymentType;
            const matchesDescription = !filters.description || item.description?.toLowerCase().includes(filters.description.toLowerCase());

            let matchesDate = true;
            if (filters.date && filters.date !== "all") {
                const filterDateMonth = getMonthName(filters.date)
                const itemDateMonth = getMonthName(item.date)
                matchesDate = filterDateMonth === itemDateMonth;
            }

            return matchesType && matchesCategory && matchesDate && matchesTypePayment && matchesDescription;
        });

        // Ordenar por fecha descendente
        return base.sort(
            (a, b) => new Date((b as any).date).getTime() - new Date((a as any).date).getTime()
        );
    }, [data, filters]);

    // Paginated data
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredData.slice(startIndex, endIndex);
    }, [filteredData, currentPage]);

    const updateQueryParams = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams as any);
        if (value === "all" || value === "") {
            params.delete(key);
        } else {
            params.set(key, value);
        }
        router.push(`?${params.toString()}`);
        router.refresh()
    };

    const table = useReactTable({
        data: paginatedData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
        initialState: {
            columnVisibility: {
                currency: false
            }
        }
    });



    return (
        <div className="flex-1">
            <div className="w-full flex flex-col md:flex-row justify-between gap-4 mb-4">
                <div className="flex gap-3">
                    <Input
                        placeholder={t("inputSearch")}
                        value={searchParams.get("description") || ""}
                        onChange={(event) => updateQueryParams("description", event.target.value)}
                        className="max-w-sm"
                    />
                    <FilterSheetWindow />
                </div>
                <NewTransactionWindow />
            </div>
            <div className="rounded-md border mb-4 overflow-scroll md:overflow-visible max-w-[380px] md:max-w-full border-gray-200 dark:border-gray-700">
                <Table className="min-w-full bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="bg-gray-50 dark:bg-gray-800">
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="border-b border-gray-200 dark:border-gray-700"
                                    >
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="border-b border-gray-100 dark:border-gray-700 last:border-0 py-4"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="px-4 py-2 sm:px-6 sm:py-3">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="text-center text-gray-500 dark:text-gray-400 py-4"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {filteredData.length > 5 &&
                <PaginationTable
                    totalPages={Math.ceil(filteredData.length / itemsPerPage)}
                    onPageChange={(page) => {
                        const params = new URLSearchParams(searchParams as any);
                        params.set("page", page.toString());
                        router.push(`?${params.toString()}`);
                        setCurrentPage(page);
                    }}
                />
            }
        </div>
    );
}
