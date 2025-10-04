"use client"
import React, { useState, ReactNode, Dispatch, SetStateAction } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils";

interface ReusableDialogWindowProps {
    /** Título del diálogo */
    title: string;
    /** Descripción del diálogo */
    description: string;
    /** Elemento que abrirá el diálogo (botón, icono, etc.) */
    trigger: ReactNode;
    /** Contenido del diálogo (generalmente un formulario) */
    children: (props: { openDialog: boolean; setOpenDialog: Dispatch<SetStateAction<boolean>> }) => ReactNode;
    /** Si el diálogo es modal (bloquea interacción con el fondo) */
    modal?: boolean;
    /** Clases CSS adicionales para el DialogContent */
    contentClassName?: string;
    /** Ancho máximo del diálogo (por defecto lg:max-w-3xl) */
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';
    /** Callback cuando el diálogo se abre/cierra */
    onOpenChange?: (open: boolean) => void;
    /** Estado controlado del diálogo (opcional) */
    open?: boolean;
}

const maxWidthClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
    '3xl': 'sm:max-w-3xl lg:max-w-3xl',
    '4xl': 'sm:max-w-4xl',
    '5xl': 'sm:max-w-5xl',
    full: 'sm:max-w-full'
};

export function ReusableDialogWindow({
    title,
    description,
    trigger,
    children,
    modal = false,
    contentClassName,
    maxWidth = '3xl',
    onOpenChange,
    open: controlledOpen
}: ReusableDialogWindowProps) {
    const [internalOpen, setInternalOpen] = useState(false);

    // Usar estado controlado si se proporciona, sino usar estado interno
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;

    // Handler para el Dialog de Radix UI
    const handleOpenChange = (newOpen: boolean) => {
        if (!isControlled) {
            setInternalOpen(newOpen);
        }
        onOpenChange?.(newOpen);
    };

    // Wrapper para el setter que se pasa a los children
    // Esto permite que funcione con Dispatch<SetStateAction<boolean>>
    const setOpenDialogWrapper: Dispatch<SetStateAction<boolean>> = (value) => {
        const newValue = typeof value === 'function' ? value(open) : value;
        handleOpenChange(newValue);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={handleOpenChange}
            modal={modal}
        >
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent
                className={cn(
                    // Layout base
                    "w-[95vw] max-w-lg",
                    maxWidthClasses[maxWidth],
                    // Ajustes responsive
                    "mx-auto rounded-xl p-6",
                    // Manejo de contenido grande
                    "max-h-[90vh] overflow-y-auto",
                    // Clases personalizadas
                    contentClassName
                )}
            >
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                {children({
                    openDialog: open,
                    setOpenDialog: setOpenDialogWrapper
                })}
            </DialogContent>
        </Dialog>
    );
}

export default ReusableDialogWindow;
