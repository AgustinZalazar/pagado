"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { number, z } from "zod"

import { toast } from "@/components/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import SearchableColorfulSelect from "./searchableColorfulSelect"

const FormSchema = z.object({
    description: z.string().min(2, {
        message: "La descripcion debe contener al menos 2 caracteres",
    }),
    amount: z.string().transform((v) => Number(v) || 0),
    type: z.string().min(2, {
        message: "Seleccione un tipo por favor",
    }),
    category: z.string(),
    // date: z.date(),
    paymentMethod: z.string(),
})

export function FormTransaction() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            description: "",
            amount: 0,
            type: "",
            category: "",
            // date: new Date,
            paymentMethod: ""
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        // toast({
        //     title: "You submitted the following values:",
        //     description: (
        //         <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        //             <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        //         </pre>
        //     ),
        // })
        console.log(data)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Descripcion</FormLabel>
                            <FormControl>
                                <Input placeholder="Alquiler" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>

                    )}
                />
                <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Monto</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="2000" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>

                    )}
                />
                {/* Campo Email */}
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tipo</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={(value) => field.onChange(value)} // Actualización manual del valor
                                    defaultValue={field.value} // Configuración inicial
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione un tipo de transaccion" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="income">Ingreso</SelectItem>
                                        <SelectItem value="expense">Gasto</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Campo Category */}
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tipo</FormLabel>
                            <FormControl>
                                <SearchableColorfulSelect field={field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Campo Date */}
                {/* <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tipo</FormLabel>
                            <FormControl>
                                <SearchableColorfulSelect field={field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                /> */}
                {/* Campo PaymentMethod */}
                <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Metodo de pago</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={(value) => field.onChange(value)} // Actualización manual del valor
                                    defaultValue={field.value} // Configuración inicial
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione un metodo de pago" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="creditCard">Tarjeta de credito</SelectItem>
                                        <SelectItem value="debitCard">Tarjeta de debito</SelectItem>
                                        <SelectItem value="cash">Efectivo</SelectItem>
                                        <SelectItem value="mp">Mercado pago</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}
