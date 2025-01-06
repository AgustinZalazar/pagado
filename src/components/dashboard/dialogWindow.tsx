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
import { FormTransaction } from "./incomes/formTransaction";

export function DialogWindow() {
    const t = useTranslations('Dashboard.Incomes');
    const [openDialog, setOpenDialog] = useState(false)
    return (
        <Dialog
            open={openDialog}
            onOpenChange={setOpenDialog}
        >
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
                <FormTransaction openDialog={openDialog} setOpenDialog={setOpenDialog} />
                {/* <DialogFooter>
                    <Button type="submit">Guardar</Button>
                </DialogFooter> */}
            </DialogContent>
        </Dialog>
    )
}
