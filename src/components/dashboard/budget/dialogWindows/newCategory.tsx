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
import { ShineButton } from "../../buttons/ShineButton";

export function NewCategoryWindow() {
    const t = useTranslations('Dashboard.Budget');
    const [openCategoryDialog, setOpenCategoryDialog] = useState(false)
    return (
        <Dialog
            open={openCategoryDialog}
            onOpenChange={setOpenCategoryDialog}
        >
            <DialogTrigger asChild>
                <ShineButton text={t("addButton")} />
            </DialogTrigger>
            <DialogContent className={cn(
                "w-[95vw] max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl",
                "mx-auto rounded-xl p-6",
                "max-h-[90vh] overflow-y-auto"
            )}>
                <DialogHeader>
                    <DialogTitle>{t("titleDialog")}</DialogTitle>
                    <DialogDescription>
                        {t("descriptionDialog")}
                    </DialogDescription>
                </DialogHeader>
                <FormCategory setOpenPopover={setOpenCategoryDialog} />
            </DialogContent>
        </Dialog>
    )
}
