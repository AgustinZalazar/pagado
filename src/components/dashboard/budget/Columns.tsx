"use client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import DeleteButton from "../buttons/deleteButton"
import { Category } from "@/types/category"
import { DialogWindow } from "../windows/DialogWindow"
import { FormCategory } from "./FormCategories"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"

const getColumnsCategories = (locale: string, categories: Category[]): ColumnDef<Category>[] => {
    const totalPercentage = categories?.reduce((sum, category) => sum + (+category.porcentaje || 0), 0);
    const [openEditDialog, setOpenEditDialog] = useState(false)
    return [
        {
            accessorKey: "id",
            header: ({ column }) => {
                return (
                    <p style={{ width: column.getSize() }} className="w-[100px] min-w-[100px] max-w-[100px] text-center">
                        Numero
                    </p>
                )
            },
            size: 100,     // Ancho ideal
            maxSize: 100,  // Máximo permitido
            minSize: 100,  // Mínimo forzado
            enableResizing: false,
            cell: ({ row, column }) => {
                return <p style={{ width: column.getSize() }} className="px-4 w-[100px] min-w-[100px] max-w-[100px]">{row.getValue("id")}</p>
            },
        },
        {
            accessorKey: "nombre",
            header: "Nombre",
            size: 200,     // Ancho ideal
            maxSize: 200,  // Máximo permitido
            minSize: 200,  // Mínimo forzado
            cell: ({ row }) => {
                return <p style={{ background: row.getValue("color") }} className={`px-4 rounded-xl w-fit text-white`}>{row.getValue("nombre")}</p>
            }
        },
        {
            accessorKey: "color",
            header: "Color",

        },
        {
            accessorKey: "porcentaje",
            header: locale === "es" ? "Porcentaje" : "Percentage",
            cell: ({ row }) => {
                return (
                    <div className="flex gap-3">
                        <Progress value={row.getValue("porcentaje")} />
                        <p>{row.getValue("porcentaje")}%</p>
                    </div>
                )
            }
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const category = row.original
                return (
                    <div className="flex gap-4">
                        <DialogWindow title="Editar categoria" description="Modifica las categorias" openEditDialog={openEditDialog} setOpenEditDialog={setOpenEditDialog} >
                            <FormCategory category={category} totalPercentage={totalPercentage} setOpenPopover={setOpenEditDialog} />
                        </DialogWindow>
                        {/* <DeleteButton id={transaction.id} date={transaction.date} /> */}
                    </div>
                )
            },
        },
    ]
};


export default getColumnsCategories