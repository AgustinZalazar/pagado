import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { FormCategory } from "../FormCategories";
import ShineButton from "../../buttons/ShineButton";

export function NewCategoryWindow() {
    const t = useTranslations('Dashboard.Incomes');
    const [openCategoryDialog, setOpenCategoryDialog] = useState(false)
    return (
        <Dialog
            open={openCategoryDialog}
            onOpenChange={setOpenCategoryDialog}
        >
            <DialogTrigger asChild>
                <ShineButton text="Agregar categoría" />
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
                    <DialogTitle>Agregar categoria</DialogTitle>
                    <DialogDescription>
                        Crea una nueva categoria
                    </DialogDescription>
                </DialogHeader>
                <FormCategory setOpenPopover={setOpenCategoryDialog} />
            </DialogContent>
        </Dialog>
    )
}
