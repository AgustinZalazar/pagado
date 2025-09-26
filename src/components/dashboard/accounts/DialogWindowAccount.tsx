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
import { ShineButton } from "../buttons/ShineButton";

export function DialogWindowAccount() {
    const t = useTranslations('Dashboard.Accounts');
    const [openAccountDialog, setOpenAccountDialog] = useState(false)
    return (
        <Dialog
            open={openAccountDialog}
            onOpenChange={setOpenAccountDialog}
        >
            <DialogTrigger asChild>
                <ShineButton text={t("buttonAdd")} />
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
                    <DialogTitle>{t("title")}</DialogTitle>
                    <DialogDescription>
                        {t("descriptionDialog")}
                    </DialogDescription>
                </DialogHeader>
                <FormAccount setOpenPopover={setOpenAccountDialog} />
            </DialogContent>
        </Dialog>
    )
}
