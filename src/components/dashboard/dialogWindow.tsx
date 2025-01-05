import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { ComboboxCustom } from "./comboBox";
import SearchableColorfulSelect from "./incomes/searchableColorfulSelect";
import { FormTransaction } from "./incomes/formTransaction";

const itemsCombo = [
    {
        value: "income",
        label: "Income",
    },
    {
        value: "expense",
        label: "Expense",
    },
]

export function DialogWindow() {
    const t = useTranslations('Dashboard.Incomes');
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>{t('buttonAdd')}</Button>
            </DialogTrigger>
            <DialogContent className="sm:w-[80%]">
                <DialogHeader>
                    <DialogTitle>Agregar transaccion</DialogTitle>
                    <DialogDescription>
                        Crea una nueva transaccion
                    </DialogDescription>
                </DialogHeader>
                <FormTransaction />
                {/* <DialogFooter>
                    <Button type="submit">Guardar</Button>
                </DialogFooter> */}
            </DialogContent>
        </Dialog>
    )
}
