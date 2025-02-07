"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaginationTable } from "../DataTableComponents/pagination";
import { NewTransactionWindow } from "./dialogWindows/newTransactionWindow";
import { FilterSheetWindow } from "./filtersSheetWindow";
import { Input } from "../../ui/input";
import { useRouter, useSearchParams } from "next/navigation";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Items per page
    const [sorting, setSorting] = React.useState<SortingState>([])

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
        return data.filter((item: any) => {
            const matchesType = !filters.type || filters.type === "all" || item.type === filters.type;
            const matchesCategory = !filters.category || filters.category === "all" || item.category === filters.category;
            const matchesTypePayment = !filters.paymentType || filters.paymentType === "all" || item.typeOfPayment === filters.paymentType;
            const matchesDescription = !filters.description || item.description?.toLowerCase().includes(filters.description.toLowerCase());

            let matchesDate = true;
            if (filters.date && filters.date !== "all") {
                const filterDate = new Date(filters.date);
                const filterYear = filterDate.getFullYear();
                const filterMonth = filterDate.getMonth();

                const itemDate = new Date(item.date);
                const itemYear = itemDate.getFullYear();
                const itemMonth = itemDate.getMonth();

                matchesDate = filterYear === itemYear && filterMonth === itemMonth;
            }

            return matchesType && matchesCategory && matchesDate && matchesTypePayment && matchesDescription;
        });
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
    });



    return (
        <div className="flex-1">
            <div className="w-full flex flex-col md:flex-row justify-between gap-4 mb-4">
                <div className="flex gap-3">
                    <Input
                        placeholder="Buscar por descripcion"
                        value={searchParams.get("description") || ""}
                        onChange={(event) => updateQueryParams("description", event.target.value)}
                        className="max-w-sm"
                    />
                    <FilterSheetWindow />
                </div>
                <NewTransactionWindow />
            </div>
            <div className="rounded-md border mb-4 overflow-scroll md:overflow-visible max-w-[380px] md:max-w-full">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <PaginationTable
                totalPages={Math.ceil(filteredData.length / itemsPerPage)}
                onPageChange={(page) => {
                    const params = new URLSearchParams(searchParams as any);
                    params.set("page", page.toString());
                    router.push(`?${params.toString()}`);
                    setCurrentPage(page);
                }}
            />
        </div>
    );
}
