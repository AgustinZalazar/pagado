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
import { Payment } from "@/types/payment";

interface Props {
    transaction: Payment
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
            <DialogContent className="sm:w-[80%]">
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
