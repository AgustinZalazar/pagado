"use client"
import React from "react"
import {
    ColumnDef,
    flexRender,
    ColumnFiltersState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
    SortingState,
    getSortedRowModel,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { PaginationTable } from "./DataTableComponents/pagination"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [expfilter, setExpFilter] = React.useState<string>("all");
    const [paymentTypefilter, setPaymentTypeFilter] = React.useState<string>("all");
    const [categoryfilter, setCategoryFilter] = React.useState<string>("all");
    const [datefilter, setDateFilter] = React.useState<string>("all");
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )

    const filteredData = React.useMemo(() => {
        return data.filter((item: any) => {
            const matchesType = expfilter === "all" || item.type === expfilter;
            const matchesCategory = categoryfilter === "all" || item.category === categoryfilter;
            const matchesDate = datefilter === "all" || item.date === datefilter;
            const matchesTypePayment = paymentTypefilter === "all" || item.typeOfPayment === paymentTypefilter;
            return matchesType && matchesCategory && matchesDate && matchesTypePayment;
        });
    }, [data, expfilter, paymentTypefilter, categoryfilter, datefilter]);

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    })
    return (
        <div className="min-h-[100vh] flex-1 md:min-h-min">
            <div className="flex flex-wrap items-center justify-between md:justify-normal gap-3 py-4">
                <Input
                    placeholder="Filter expenses or incomes..."
                    value={(table.getColumn("description")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("description")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <Select onValueChange={(value) => setExpFilter(value)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All types</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                        <SelectItem value="income">Income</SelectItem>
                    </SelectContent>
                </Select>
                <Select onValueChange={(value) => setPaymentTypeFilter(value)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by payment types" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All payment types</SelectItem>
                        <SelectItem value="Credit Card">Credit Card</SelectItem>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                        <SelectItem value="Debit Card">Debit Card</SelectItem>
                        <SelectItem value="Online Payment">Online Payment</SelectItem>
                    </SelectContent>
                </Select>
                <Select onValueChange={(value) => setCategoryFilter(value)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All categories</SelectItem>
                        <SelectItem value="Entertainment">Entertainment</SelectItem>
                        <SelectItem value="Work">Work</SelectItem>
                        <SelectItem value="Food">Food</SelectItem>
                        <SelectItem value="Utilities">Utilities</SelectItem>
                        <SelectItem value="Salary">Salary</SelectItem>
                    </SelectContent>
                </Select>
                <Select onValueChange={(value) => setDateFilter(value)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by dates" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Dates</SelectItem>
                        <SelectItem value="2023-12-01">December 2023</SelectItem>
                        <SelectItem value="2024-01-01">January 2024</SelectItem>
                        <SelectItem value="2024-12-01">December 2024</SelectItem>
                    </SelectContent>
                </Select>
                <Button className="flex-1 md:flex-initial ml-auto">
                    Add transaction
                </Button>
            </div>
            <div className="rounded-md border mb-4  overflow-scroll md:overflow-visible max-w-[380px] md:max-w-none">
                <Table className="bg-white">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <PaginationTable />
            {/* <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div> */}
        </div>
    )
}
