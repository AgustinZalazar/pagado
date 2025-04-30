"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Category } from "@/types/category"
import { useCreateCategory, useEditCategory } from "@/hooks/useGetCategories"
import { colors } from "@/data/colors"
import { icons } from "@/data/icons"
import { Dispatch, SetStateAction } from "react"
import { toast } from "sonner";

const FormSchema = z.object({
    nombre: z.string().min(2, {
        message: "El nombre debe contener al menos 2 caracteres",
    }),
    // porcentaje: z.string().transform((v) => Number(v) || 0),
    porcentaje: z
        .preprocess(
            (val) => Number(val), // 🔹 Convierte el valor a número antes de validarlo
            z.number()
                .min(0, { message: "El porcentaje debe ser al menos 0" })
                .max(100, { message: "El porcentaje no puede ser mayor a 100" })
        ),
    color: z.string(),
    icon: z.string()
})

interface formProps {
    category?: Category,
    totalPercentage?: number,
    setOpenPopover: Dispatch<SetStateAction<boolean>>
}

export function FormCategory({ category, totalPercentage, setOpenPopover }: formProps) {
    const { editCategory } = useEditCategory(setOpenPopover)
    const { createCategory } = useCreateCategory(setOpenPopover)

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            nombre: category ? category.nombre : "",
            porcentaje: category ? category.porcentaje : 0,
            color: category ? category.color : "",
            icon: category ? category.icon : ""
        },
    })
    async function onSubmit(data: z.infer<typeof FormSchema>) {
        // console.log(data, category)
        if (category && totalPercentage! <= 100 && totalPercentage! + data.porcentaje <= 100) {
            const allData = { id: category.id, ...data }
            const updateCategory = editCategory(allData)
        } else if (totalPercentage == 100 && totalPercentage + data.porcentaje >= 100) {
            toast.error("Error, La sumatoria de los porcentajes no puede ser mayor al 100%.");
        }
        else if (!category) {
            const newCategory = createCategory({ id: "", ...data })
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                <FormField
                    control={form.control}
                    name="nombre"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                                <Input placeholder="Servicios" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>

                    )}
                />
                <FormField
                    control={form.control}
                    name="porcentaje"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Porcentaje</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min={0}
                                    max={100}
                                    placeholder="20%"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>

                    )}
                />
                <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Selecciona un color</FormLabel>
                            <FormControl>
                                <div className="grid grid-cols-10 gap-2 mt-2" id="color-selection">
                                    {colors.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            className={`
                                                relative w-6 h-6 aspect-square rounded-md transition-all
                                                ${field.value === color ? "ring-2 ring-offset-2 ring-primary " : "hover:scale-105"}
                                            `}
                                            style={{ backgroundColor: color }}
                                            onClick={() => field.onChange(color)}
                                            aria-label={color}
                                        >
                                            {/* {field.value === color && (
                                                <Check
                                                    className={`
                                                    absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5
                                                    ${["#eab308", "#22c55e", "#14b8a6", "#3b82f6", "#6366f1", "#a855f7", "#ec4899", "#892350"].includes(color) ? "text-white" : "text-black"}
                                                `}
                                                />
                                            )} */}
                                        </button>
                                    ))}
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Selecciona un icono</FormLabel>
                            <FormControl>
                                <div className="grid grid-cols-10 gap-2 mt-2" id="color-selection">
                                    {icons.map((icon) => (
                                        <button
                                            key={icon.name}
                                            type="button"
                                            className={`
                                                relative w-6 h-6 aspect-square rounded-md transition-all
                                                ${field.value === icon.name ? "ring-1 ring-offset-2 ring-primary " : "hover:scale-105"}
                                            `}
                                            onClick={() => field.onChange(icon.name)}
                                        >
                                            <icon.icon className="w-5 absolute inset-1/2 -translate-y-1/2 -translate-x-1/2" />
                                            {/* {field.value === icon.name && (
                                                <Check
                                                    className={`
                                                    absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                                                `}
                                                />
                                            )} */}
                                        </button>
                                    ))}
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Guardar</Button>
            </form>
        </Form>
    )
}
