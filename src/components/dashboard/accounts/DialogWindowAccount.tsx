"use client"
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
import FormAccount from "./FormAccount";

export function DialogWindowAccount() {
    const t = useTranslations('Dashboard.Incomes');
    const [openAccountDialog, setOpenAccountDialog] = useState(false)
    return (
        <Dialog
            open={openAccountDialog}
            onOpenChange={setOpenAccountDialog}
        >
            <DialogTrigger asChild>
                <Button className={cn(
                    "animate-shine items-center justify-center rounded-xl border border-white/10 bg-[linear-gradient(110deg,#000000,45%,#303030,55%,#000000)]",
                    "bg-[length:400%_100%] px-4 py-2 text-sm font-medium text-neutral-200 transition-colors dark:border-neutral-800",
                    "dark:bg-[linear-gradient(110deg,#000103,45%,#303030,55%,#000103)] dark:text-neutral-400 max-w-[200px]",
                )}>Agregar cuenta</Button>
            </DialogTrigger>
            <DialogContent className="sm:w-[80%]">
                <DialogHeader>
                    <DialogTitle>Agregar cuenta</DialogTitle>
                    <DialogDescription>
                        Crea una cuenta nueva
                    </DialogDescription>
                </DialogHeader>
                <FormAccount setOpenPopover={setOpenAccountDialog} />
            </DialogContent>
        </Dialog>
    )
}
