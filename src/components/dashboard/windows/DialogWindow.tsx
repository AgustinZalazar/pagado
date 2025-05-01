import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import React, { Dispatch, SetStateAction, useState } from "react";
import { Pencil } from "lucide-react";

interface Props {
    children: JSX.Element,
    title: string,
    description: string,
    btnText?: string,
    openEditDialog: boolean,
    setOpenEditDialog: Dispatch<SetStateAction<boolean>>
}

export function DialogWindow({ children, title, description, btnText, openEditDialog, setOpenEditDialog }: Props) {
    // const [openEditDialog, setOpenEditDialog] = useState(false)
    return (
        <Dialog
            open={openEditDialog}
            onOpenChange={setOpenEditDialog}
        >
            <DialogTrigger asChild>
                <button className="bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-sm flex gap-2">
                    <Pencil className="w-4 text-gray-600" /> {btnText}
                </button>
            </DialogTrigger>
            <DialogContent className="sm:w-[80%]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    )
}
