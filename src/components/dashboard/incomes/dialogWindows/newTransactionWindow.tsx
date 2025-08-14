import React, { useState } from "react";
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
import { FormTransaction } from "../formTransaction";
import { cn } from "@/lib/utils";

export function NewTransactionWindow() {
    const t = useTranslations('Dashboard.Incomes');
    const [openDialog, setOpenDialog] = useState(false)
    return (
        <Dialog
            open={openDialog}
            onOpenChange={setOpenDialog}
            modal
        >
            <DialogTrigger asChild>
                <Button className={cn(
                    "animate-shine items-center justify-center rounded-xl border border-white/10 bg-[linear-gradient(110deg,#000000,45%,#303030,55%,#000000)]",
                    "bg-[length:400%_100%] px-4 py-2 text-sm font-medium text-neutral-200 transition-colors dark:border-neutral-800",
                    "dark:bg-[linear-gradient(110deg,#000103,45%,#303030,55%,#000103)] dark:text-neutral-400",
                )}>{t('buttonAdd')}</Button>
            </DialogTrigger>
            <DialogContent className="max-w-[350px] rounded-md md:min-w-[650px]">
                <DialogHeader>
                    <DialogTitle>Agregar transaccion</DialogTitle>
                    <DialogDescription>
                        Crea una nueva transaccion
                    </DialogDescription>
                </DialogHeader>
                <FormTransaction openDialog={openDialog} setOpenDialog={setOpenDialog} />
            </DialogContent>
        </Dialog>
    )
}
