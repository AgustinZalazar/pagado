import React from "react";
import { useTranslations } from "next-intl";
import { FormTransaction } from "../formTransaction";
import { Pencil } from "lucide-react";
import { Transaction } from "@/types/transaction";
import { ReusableDialogWindow } from "@/components/dashboard/windows/ReusableDialogWindow";

interface Props {
    transaction: Transaction
}

export function EditDialogWindow({ transaction }: Props) {
    const t = useTranslations('Dashboard.Incomes');

    return (
        <ReusableDialogWindow
            title={t('dialogEditTitle')}
            description={t('dialogEditDescription')}
            trigger={
                <button className="bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-sm">
                    <Pencil className="w-4 text-gray-600" />
                </button>
            }
        >
            {({ openDialog, setOpenDialog }) => (
                <FormTransaction
                    openDialog={openDialog}
                    setOpenDialog={setOpenDialog}
                    transaction={transaction}
                />
            )}
        </ReusableDialogWindow>
    )
}
