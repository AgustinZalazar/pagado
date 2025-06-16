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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { SearchableColorfulSelect } from "./searchableColorfulSelect"
import { CalendarIcon, Currency } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Dispatch, SetStateAction, useState } from "react"
import { Transaction } from "@/types/transaction"
import { useCreateTransaction, useEditTransaction } from "@/hooks/useGetTransactions"
import { useGetAccounts } from "@/hooks/useAccount"
import { useGetMethods } from "@/hooks/useMethod"
import { Account, Method } from "@/types/Accounts"
import { CustomSelect } from "@/components/ui/custom-select"
import { countryCurrencyMap } from "@/data/currency"

function formatInputAmount(input: string): string {
    if (input === "") return "";
    const parts = input.split(",");
    const intPart = parts[0].replace(/\D/g, "");
    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.length === 2 ? `${formattedInt},${parts[1].slice(0, 2)}` : formattedInt;
}

const RawFormSchema = z.object({
    description: z.string().min(2, {
        message: "La descripcion debe contener al menos 2 caracteres",
    }),
    amount: z.string().refine(
        (val) => {
            const normalized = val.replace(/\./g, "").replace(",", ".");
            const parsed = parseFloat(normalized);
            return !isNaN(parsed) && parsed > 0;
        },
        { message: "El monto debe ser un número válido y mayor que 0" }
    ),
    currency: z.string(),
    type: z.string().min(2, { message: "Seleccione un tipo por favor" }),
    category: z.string(),
    date: z.date(),
    account: z.string(),
    method: z.string(),
});

const FormSchema = RawFormSchema.transform((data) => ({
    ...data,
    amount: parseFloat(data.amount.replace(/\./g, "").replace(",", ".")),
}));

interface formProps {
    openDialog: boolean,
    setOpenDialog: Dispatch<SetStateAction<boolean>>
    transaction?: Transaction
}

export function FormTransaction({ openDialog, setOpenDialog, transaction }: formProps) {
    const { createTransaction } = useCreateTransaction(setOpenDialog)
    const { editTransaction } = useEditTransaction(setOpenDialog)
    const { accounts } = useGetAccounts();
    const { methods } = useGetMethods();
    const [selectedAccount, setSelectedAccount] = useState<string>("")
    const [amountDisplay, setAmountDisplay] = useState<string>(
        transaction ? formatInputAmount(transaction.amount.toString().replace('.', ',')) : ''
    );

    const form = useForm<z.infer<typeof RawFormSchema>>({
        resolver: zodResolver(RawFormSchema),
        defaultValues: {
            description: transaction ? transaction.description : "",
            amount: transaction ? formatInputAmount(transaction.amount.toString().replace('.', ',')) : "",
            currency: transaction ? transaction.currency : "",
            type: transaction ? transaction.type : "",
            category: transaction ? transaction.category : "",
            account: transaction ? transaction.account : "",
            method: transaction ? transaction.method : "",
            date: transaction && new Date(transaction.date)
        },
    })
    async function onSubmit(rawData: z.infer<typeof RawFormSchema>) {
        const result = FormSchema.safeParse(rawData);
        if (!result.success) {
            console.error("Transformación fallida", result.error);
            return;
        }

        const data = result.data; // `amount` es number

        setOpenDialog(!openDialog);

        if (transaction) {
            editTransaction({
                id: transaction.id,
                ...data,
                type: data.type as "income" | "expense",
                date: data.date.toString(),
            });
        } else {
            createTransaction({
                id: "",
                ...data,
                type: data.type as "income" | "expense",
                date: data.date.toString(),
            });
        }
    }

    const availableCurrencies = Array.from(
        new Map(
            countryCurrencyMap.map(({ currency, code }) => [code, { currency, code }])
        ).values()
    ).sort((a, b) => a.currency.localeCompare(b.currency));

    const currencyOptions = availableCurrencies.map(({ currency, code }) => ({
        value: code,
        label: `${currency} (${code})`,
    }));
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
                                <Input
                                    type="text"
                                    inputMode="decimal"
                                    placeholder="1.234,56"
                                    value={amountDisplay}
                                    onChange={(e) => {
                                        const raw = e.target.value;
                                        const cleaned = raw.replace(/[^\d,]/g, '');
                                        const parts = cleaned.split(',');
                                        if (parts.length > 2) return;
                                        const formattedInt = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                                        const display = parts.length === 2 ? `${formattedInt},${parts[1]}` : formattedInt;
                                        setAmountDisplay(display);
                                        field.onChange(cleaned);
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                        <FormItem className="relative">
                            <FormLabel>Moneda</FormLabel>
                            <FormControl>
                                <CustomSelect
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    options={currencyOptions}
                                    placeholder="Selecciona una moneda"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Campo Tipo */}
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
                    name="account"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cuenta</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        const account = accounts.find((acc: Account) => acc.title === value);
                                        if (account) setSelectedAccount(account.id);
                                    }}
                                    defaultValue={field.value}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione una cuenta" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {accounts.map((account: Account) => (
                                            <SelectItem key={account.id} value={account.title}>{account.title}</SelectItem>
                                        ))
                                        }
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="method"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Metodo de pago</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={(value) => field.onChange(value)}
                                    defaultValue={field.value}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione un metodo de pago" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {methods.filter((method: Method) => method.idAccount === selectedAccount).map((method: Method) => (
                                            <SelectItem key={method.id} value={method.cardType ? `${method.title} - ${method.cardType}` : `${method.title}`}>
                                                {method.cardType ? `${method.title} - ${method.cardType}` : `${method.title}`}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
