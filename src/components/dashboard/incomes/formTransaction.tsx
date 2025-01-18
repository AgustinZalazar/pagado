"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
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
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { SearchableColorfulSelect } from "./searchableColorfulSelect"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Dispatch, SetStateAction } from "react"

const FormSchema = z.object({
    description: z.string().min(2, {
        message: "La descripcion debe contener al menos 2 caracteres",
    }),
    amount: z.string().transform((v) => Number(v) || 0),
    type: z.string().min(2, {
        message: "Seleccione un tipo por favor",
    }),
    category: z.string(),
    date: z.date(),
    paymentMethod: z.string(),
})

interface formProps {
    openDialog: boolean,
    setOpenDialog: Dispatch<SetStateAction<boolean>>
}

export function FormTransaction({ openDialog, setOpenDialog }: formProps) {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            description: "",
            amount: 0,
            type: "",
            category: "",
            paymentMethod: ""
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setOpenDialog(!openDialog)
        const newTransaction = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/transaction`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        toast({
            title: "Listo!",
            description: (
                <p className="mt-2 w-[340px] rounded-md  p-4">
                    Transaccion guardada correctamente!
                </p>
            ),
        })
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
                            <FormLabel>Categoria</FormLabel>
                            <FormControl>
                                <SearchableColorfulSelect field={field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Campo Date */}
                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Fecha</FormLabel>
                            <Popover modal>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Elegi una fecha</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                            date > new Date() || date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
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
