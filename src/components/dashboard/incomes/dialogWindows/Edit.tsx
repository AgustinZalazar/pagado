import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { FormTransaction } from "../formTransaction";
import { Pencil } from "lucide-react";
import { Transaction } from "@/types/transaction";
import { cn } from "@/lib/utils";

interface Props {
    transaction: Transaction
}

export function EditDialogWindow({ transaction }: Props) {
    // const t = useTranslations('Dashboard.Incomes');
    const [openEditDialog, setOpenEditDialog] = useState(false)
    return (
        <Dialog
            open={openEditDialog}
            onOpenChange={setOpenEditDialog}
        >
            <DialogTrigger asChild>
                <button className="bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-sm">
                    <Pencil className="w-4 text-gray-600" />
                </button>
            </DialogTrigger>
            <DialogContent className={cn(
                // Layout base
                "w-[95vw] max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl",
                // Ajustes responsive
                "mx-auto rounded-xl p-6",
                // Manejo de contenido grande
                "max-h-[90vh] overflow-y-auto"
            )}>
                <DialogHeader>
                    <DialogTitle>Editar transaccion</DialogTitle>
                    <DialogDescription>
                        Edita la transaccion seleccionada
                    </DialogDescription>
                </DialogHeader>
                <FormTransaction openDialog={openEditDialog} setOpenDialog={setOpenEditDialog} transaction={transaction} />
            </DialogContent>
        </Dialog>
    )
}
