"use client"
import React from 'react'
import { Category } from '@/types/category'
import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Props<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[]
}

export function DataTableContainer<TData, TValue>({ data, columns }: Props<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const table = useReactTable({
        data: data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        columnResizeMode: "onChange",
        enableColumnResizing: true,
        state: {
            sorting,
        },
    });
    // console.log(data)
    return (
        <div className="flex-1">
            <div className="rounded-md border mb-4 overflow-scroll md:overflow-visible max-w-[380px] md:max-w-[80%] md:mx-auto">
                <Table className='table-fixed'>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} style={{ width: header.getSize() }}>
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
                                        <TableCell key={cell.id} className="overflow-hidden text-ellipsis whitespace-nowrap">
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
        </div>
    )
}