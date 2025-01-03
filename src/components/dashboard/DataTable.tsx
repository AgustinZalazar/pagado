"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaginationTable } from "./DataTableComponents/pagination";
import { DialogWindow } from "./dialogWindow";
import { FilterControls } from "./incomes/filterControls";
import { SheetWindow } from "./sheetWindow";
import { Input } from "../ui/input";
import { useRouter, useSearchParams } from "next/navigation";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [filters, setFilters] = useState<Record<string, string>>({});

    // Convert search params into an object
    useEffect(() => {
        const params: Record<string, string> = {};
        searchParams.forEach((value, key) => {
            params[key] = value;
        });
        setFilters(params);
    }, [searchParams]);

    const filteredData = useMemo(() => {
        return data.filter((item: any) => {
            const matchesType = !filters.type || filters.type === "all" || item.type === filters.type;
            const matchesCategory =
                !filters.category || filters.category === "all" || item.category === filters.category;
            const matchesDate = !filters.date || filters.date === "all" || item.date === filters.date;
            const matchesTypePayment =
                !filters.paymentType ||
                filters.paymentType === "all" ||
                item.typeOfPayment === filters.paymentType;
            const matchesDescription =
                !filters.description || item.description?.toLowerCase().includes(filters.description.toLowerCase());
            return matchesType && matchesCategory && matchesDate && matchesTypePayment && matchesDescription;
        });
    }, [data, filters]);

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const updateQueryParams = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams as any);
        if (value === "all" || value === "") {
            params.delete(key);
        } else {
            params.set(key, value);
        }
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="min-h-[100vh] flex-1">
            <div className="w-full flex justify-between mb-4">
                <div className="flex gap-3">
                    <Input
                        placeholder="Buscar por descripcion"
                        // value={searchParams.get("description") || ""}
                        onChange={(event) => updateQueryParams("description", event.target.value)}
                        className="max-w-sm"
                    />
                    <SheetWindow />
                </div>
                {/* <FilterControls onFilterChange={setFilters} /> */}
                <DialogWindow />
            </div>
            <div className="rounded-md border mb-4 overflow-scroll md:overflow-visible max-w-full">
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
            <PaginationTable />
        </div>
    );
}
