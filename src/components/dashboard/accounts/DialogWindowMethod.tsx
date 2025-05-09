import React, { useState } from "react";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import FormMethod from "./FormMethod";
import { Method } from "@/types/Accounts";
import { Edit2, Plus } from "lucide-react";


interface Props {
    method?: Method,
    isEdit?: boolean,
    idAccount: string
}


export function DialogMethod({ method, isEdit, idAccount }: Props) {
    // const t = useTranslations('Dashboard.Incomes');
    const [openMethodDialog, setOpenMethodDialog] = useState(false)
    return (
        <Dialog
            open={openMethodDialog}
            onOpenChange={setOpenMethodDialog}
        >
            <DialogTrigger asChild>
                {isEdit ?
                    <Button variant="ghost" size="sm" className="rounded-full">
                        <Edit2 className="h-4 w-4" />
                    </Button>
                    :
                    <Button
                        variant="outline"
                        className="w-full mt-2 border-dashed flex items-center justify-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Agregar metodo de pago
                    </Button>
                }
            </DialogTrigger>
            <DialogContent className="sm:w-[80%]">
                <DialogHeader>
                    <DialogTitle>Agregar metodo de pago</DialogTitle>
                    <DialogDescription>
                        Crea un nuevo metodo de pago
                    </DialogDescription>
                </DialogHeader>
                <FormMethod method={method} idAccount={idAccount} setOpenPopover={setOpenMethodDialog} />
            </DialogContent>
        </Dialog>
    )
}
