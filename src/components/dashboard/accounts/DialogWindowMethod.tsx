import React from "react";
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl";
import FormMethod from "./FormMethod";
import { Method } from "@/types/Accounts";
import { Edit2, Plus } from "lucide-react";
import { ReusableDialogWindow } from "../windows/ReusableDialogWindow";

interface Props {
    method?: Method,
    isEdit?: boolean,
    idAccount: string
}

export function DialogMethod({ method, isEdit, idAccount }: Props) {
    const t = useTranslations('Dashboard.Accounts');

    return (
        <ReusableDialogWindow
            title={t('titleDialogMethod')}
            description={t('descriptionDialogMethod')}
            trigger={
                isEdit ? (
                    <Button variant="ghost" size="sm" className="rounded-full">
                        <Edit2 className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button
                        variant="outline"
                        className="w-full mt-2 border-dashed flex items-center justify-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        {t("buttonAddPayment")}
                    </Button>
                )
            }
        >
            {({ setOpenDialog }) => (
                <FormMethod method={method} idAccount={idAccount} setOpenPopover={setOpenDialog} />
            )}
        </ReusableDialogWindow>
    )
}
