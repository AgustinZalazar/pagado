# ReusableDialogWindow - Guía de Uso

## 📖 Descripción

`ReusableDialogWindow` es un componente reutilizable que encapsula la lógica común de todos los Dialog Windows de la aplicación, reduciendo código duplicado y mejorando la mantenibilidad.

## ✨ Características

- ✅ Gestión automática del estado de apertura/cierre
- ✅ Soporte para estado controlado y no controlado
- ✅ Trigger personalizable (cualquier elemento React)
- ✅ Tamaños predefinidos y personalizables
- ✅ Modo modal opcional
- ✅ Completamente tipado con TypeScript
- ✅ Clases CSS personalizables

## 📦 Props

| Prop | Tipo | Requerido | Default | Descripción |
|------|------|-----------|---------|-------------|
| `title` | `string` | ✅ | - | Título del diálogo |
| `description` | `string` | ✅ | - | Descripción del diálogo |
| `trigger` | `ReactNode` | ✅ | - | Elemento que abre el diálogo |
| `children` | `function` | ✅ | - | Render prop que recibe `openDialog` y `setOpenDialog` |
| `modal` | `boolean` | ❌ | `false` | Si bloquea interacción con el fondo |
| `contentClassName` | `string` | ❌ | - | Clases CSS adicionales |
| `maxWidth` | `'sm'\|'md'\|'lg'\|'xl'\|'2xl'\|'3xl'\|'4xl'\|'5xl'\|'full'` | ❌ | `'3xl'` | Ancho máximo |
| `onOpenChange` | `(open: boolean) => void` | ❌ | - | Callback al cambiar estado |
| `open` | `boolean` | ❌ | - | Estado controlado |

## 🎯 Ejemplos de Uso

### Ejemplo 1: Nuevo Transaction (Antes y Después)

#### ❌ ANTES (50 líneas de código repetitivo)

\`\`\`tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useTranslations } from "next-intl";
import { FormTransaction } from "../formTransaction";
import { cn } from "@/lib/utils";

export function NewTransactionWindow() {
    const t = useTranslations('Dashboard.Incomes');
    const [openDialog, setOpenDialog] = useState(false)
    return (
        <Dialog
            open={openDialog}
            onOpenChange={setOpenDialog}
            modal
        >
            <DialogTrigger asChild>
                <Button className={cn(
                    "animate-shine items-center justify-center rounded-xl border border-white/10 bg-[linear-gradient(110deg,#000000,45%,#303030,55%,#000000)]",
                    "bg-[length:400%_100%] px-4 py-2 text-sm font-medium text-neutral-200 transition-colors dark:border-neutral-800",
                    "dark:bg-[linear-gradient(110deg,#000103,45%,#303030,55%,#000103)] dark:text-neutral-400",
                )}>{t('buttonAdd')}</Button>
            </DialogTrigger>
            <DialogContent className={cn(
                "w-[95vw] max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl",
                "mx-auto rounded-xl p-6",
                "max-h-[90vh] overflow-y-auto"
            )}>
                <DialogHeader>
                    <DialogTitle>{t('dialogTitle')}</DialogTitle>
                    <DialogDescription>
                        {t('dialogDescription')}
                    </DialogDescription>
                </DialogHeader>
                <FormTransaction openDialog={openDialog} setOpenDialog={setOpenDialog} />
            </DialogContent>
        </Dialog>
    )
}
\`\`\`

#### ✅ DESPUÉS (25 líneas, 50% menos código!)

\`\`\`tsx
import React from "react";
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl";
import { FormTransaction } from "../formTransaction";
import { cn } from "@/lib/utils";
import { ReusableDialogWindow } from "@/components/dashboard/windows/ReusableDialogWindow";

export function NewTransactionWindow() {
    const t = useTranslations('Dashboard.Incomes');

    return (
        <ReusableDialogWindow
            title={t('dialogTitle')}
            description={t('dialogDescription')}
            modal
            trigger={
                <Button className={cn(
                    "animate-shine items-center justify-center rounded-xl border border-white/10 bg-[linear-gradient(110deg,#000000,45%,#303030,55%,#000000)]",
                    "bg-[length:400%_100%] px-4 py-2 text-sm font-medium text-neutral-200 transition-colors dark:border-neutral-800",
                    "dark:bg-[linear-gradient(110deg,#000103,45%,#303030,55%,#000103)] dark:text-neutral-400",
                )}>{t('buttonAdd')}</Button>
            }
        >
            {({ openDialog, setOpenDialog }) => (
                <FormTransaction openDialog={openDialog} setOpenDialog={setOpenDialog} />
            )}
        </ReusableDialogWindow>
    )
}
\`\`\`

### Ejemplo 2: Edit Transaction con Trigger Personalizado

\`\`\`tsx
import { Pencil } from "lucide-react";
import { Transaction } from "@/types/transaction";
import { ReusableDialogWindow } from "@/components/dashboard/windows/ReusableDialogWindow";
import { FormTransaction } from "../formTransaction";
import { useTranslations } from "next-intl";

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
\`\`\`

### Ejemplo 3: New Category con ShineButton

\`\`\`tsx
import { ReusableDialogWindow } from "@/components/dashboard/windows/ReusableDialogWindow";
import { FormCategory } from "../FormCategories";
import { ShineButton } from "../../buttons/ShineButton";
import { useTranslations } from "next-intl";

export function NewCategoryWindow() {
    const t = useTranslations('Dashboard.Budget');

    return (
        <ReusableDialogWindow
            title={t("titleDialog")}
            description={t("descriptionDialog")}
            trigger={<ShineButton text={t("addButton")} />}
        >
            {({ setOpenDialog }) => (
                <FormCategory setOpenPopover={setOpenDialog} />
            )}
        </ReusableDialogWindow>
    )
}
\`\`\`

### Ejemplo 4: Dialog con Trigger Condicional (Edit vs New)

\`\`\`tsx
import { Button } from "@/components/ui/button"
import { Edit2, Plus } from "lucide-react";
import { ReusableDialogWindow } from "@/components/dashboard/windows/ReusableDialogWindow";
import FormMethod from "./FormMethod";
import { Method } from "@/types/Accounts";
import { useTranslations } from "next-intl";

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
                <FormMethod
                    method={method}
                    idAccount={idAccount}
                    setOpenPopover={setOpenDialog}
                />
            )}
        </ReusableDialogWindow>
    )
}
\`\`\`

### Ejemplo 5: Dialog con Ancho Personalizado

\`\`\`tsx
<ReusableDialogWindow
    title="Configuración Avanzada"
    description="Ajusta las opciones avanzadas"
    maxWidth="5xl"  // Dialog más ancho
    trigger={<Button>Abrir Configuración</Button>}
>
    {({ openDialog, setOpenDialog }) => (
        <ComplexForm openDialog={openDialog} setOpenDialog={setOpenDialog} />
    )}
</ReusableDialogWindow>
\`\`\`

### Ejemplo 6: Dialog Controlado (Estado Externo)

\`\`\`tsx
function ParentComponent() {
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = () => {
        // Hacer algo...
        setIsOpen(false); // Cerrar desde fuera
    };

    return (
        <>
            <button onClick={() => setIsOpen(true)}>Abrir desde fuera</button>

            <ReusableDialogWindow
                title="Dialog Controlado"
                description="Este dialog es controlado externamente"
                open={isOpen}
                onOpenChange={setIsOpen}
                trigger={<Button>Trigger Alternativo</Button>}
            >
                {({ setOpenDialog }) => (
                    <MyForm onSubmit={handleSubmit} onCancel={() => setOpenDialog(false)} />
                )}
            </ReusableDialogWindow>
        </>
    );
}
\`\`\`

## 🎨 Tamaños Disponibles

| Valor | Ancho Máximo | Uso Recomendado |
|-------|-------------|-----------------|
| `'sm'` | `sm:max-w-sm` (384px) | Confirmaciones simples |
| `'md'` | `sm:max-w-md` (448px) | Formularios pequeños |
| `'lg'` | `sm:max-w-lg` (512px) | Formularios medianos |
| `'xl'` | `sm:max-w-xl` (576px) | Formularios estándar |
| `'2xl'` | `sm:max-w-2xl` (672px) | Formularios grandes |
| `'3xl'` | `lg:max-w-3xl` (768px) | **Default** - Formularios complejos |
| `'4xl'` | `sm:max-w-4xl` (896px) | Contenido muy amplio |
| `'5xl'` | `sm:max-w-5xl` (1024px) | Pantallas completas |
| `'full'` | `sm:max-w-full` | Sin límite de ancho |

## 🚀 Ventajas

1. **Menos Código**: Reducción del 40-60% de código por componente
2. **Consistencia**: Todos los dialogs tienen el mismo comportamiento
3. **Mantenibilidad**: Un solo lugar para actualizar la lógica común
4. **Tipado**: TypeScript asegura uso correcto
5. **Flexibilidad**: Soporta casos de uso simples y complejos
6. **Performance**: Estado optimizado y re-renders mínimos

## 📝 Notas Importantes

- Los formularios deben aceptar props `openDialog` y `setOpenDialog`
- El componente usa render props para máxima flexibilidad
- El estado puede ser controlado o no controlado
- Compatible con todos los triggers existentes

## 🔄 Migración Paso a Paso

1. Importa `ReusableDialogWindow`
2. Extrae el trigger a una prop
3. Extrae title y description del useTranslations
4. Mueve el formulario a la función children
5. Elimina código duplicado de Dialog, DialogContent, etc.
6. ¡Listo! Has reducido tu código en ~50%

## 🐛 Troubleshooting

**Problema**: El formulario no recibe openDialog/setOpenDialog
- **Solución**: Verifica que uses la función children con desestructuración

**Problema**: El dialog no se cierra
- **Solución**: Asegúrate de llamar a `setOpenDialog(false)` en tu formulario

**Problema**: Estilos diferentes
- **Solución**: Usa la prop `contentClassName` para agregar clases personalizadas
