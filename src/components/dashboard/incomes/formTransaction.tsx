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
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Dispatch, SetStateAction, useState, useEffect, useMemo } from "react"
import { Transaction } from "@/types/transaction"
import { useCreateTransaction, useEditTransaction } from "@/hooks/useGetTransactions"
import { useGetAccounts } from "@/hooks/useAccount"
import { useGetMethods } from "@/hooks/useMethod"
import { Account, Method } from "@/types/Accounts"
import { CustomSelect } from "@/components/ui/custom-select"
import { countryCurrencyMap } from "@/data/currency"

// Función para formatear el input de moneda
function formatCurrencyInput(value: string): string {
    if (!value) return "";

    // Remover todo excepto dígitos y coma
    const cleaned = value.replace(/[^\d,]/g, '');

    // Dividir en parte entera y decimal
    const parts = cleaned.split(',');
    if (parts.length > 2) return value; // No permitir más de una coma

    // Formatear parte entera con puntos cada 3 dígitos
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    // Limitar decimales a 2 dígitos
    const decimalPart = parts[1] ? parts[1].slice(0, 2) : '';

    return parts.length === 2 ? `${integerPart},${decimalPart}` : integerPart;
}

// Función para convertir display a número
function parseDisplayAmount(displayValue: string): number {
    if (!displayValue) return 0;
    const normalized = displayValue.replace(/\./g, "").replace(",", ".");
    return parseFloat(normalized) || 0;
}

// Función para convertir número a display
function numberToDisplay(num: number): string {
    if (!num) return "";
    return formatCurrencyInput(num.toString().replace('.', ','));
}

const FormSchema = z.object({
    description: z.string().min(2, {
        message: "La descripcion debe contener al menos 2 caracteres",
    }),
    amount: z.number().positive({
        message: "El monto debe ser mayor que 0"
    }),
    currency: z.string().min(1, { message: "Seleccione una moneda" }),
    type: z.enum(["income", "expense"], {
        errorMap: () => ({ message: "Seleccione un tipo por favor" })
    }),
    category: z.string().min(1, { message: "Seleccione una categoría" }),
    date: z.date({ required_error: "Seleccione una fecha" }),
    account: z.string().min(1, { message: "Seleccione una cuenta" }),
    method: z.string().min(1, { message: "Seleccione un método de pago" }),
});

interface FormProps {
    openDialog: boolean;
    setOpenDialog: Dispatch<SetStateAction<boolean>>;
    transaction?: Transaction;
}

export function FormTransaction({ openDialog, setOpenDialog, transaction }: FormProps) {
    const { createTransaction } = useCreateTransaction(setOpenDialog);
    const { editTransaction } = useEditTransaction(setOpenDialog);
    const { accounts } = useGetAccounts();
    const { methods } = useGetMethods();

    // Estados locales
    const [selectedAccountId, setSelectedAccountId] = useState<string>("");
    const [displayAmount, setDisplayAmount] = useState<string>("");

    // Memoizar las opciones de moneda para evitar re-renders
    const currencyOptions = useMemo(() => {
        const availableCurrencies = Array.from(
            new Map(
                countryCurrencyMap.map(({ currency, code }) => [code, { currency, code }])
            ).values()
        ).sort((a, b) => a.currency.localeCompare(b.currency));

        return availableCurrencies.map(({ currency, code }) => ({
            value: code,
            label: `${currency} (${code})`,
        }));
    }, []);

    // Memoizar los métodos filtrados
    const filteredMethods = useMemo(() => {
        if (!selectedAccountId) return [];
        return methods.filter((method: Method) => method.idAccount === selectedAccountId);
    }, [selectedAccountId, methods]);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            description: transaction?.description || "",
            amount: transaction?.amount || 0,
            currency: transaction?.currency || "",
            type: transaction?.type as "income" | "expense" || undefined,
            category: transaction?.category || "",
            account: transaction?.account || "",
            method: transaction?.method || "",
            date: transaction ? new Date(transaction.date) : undefined,
        },
    });

    // Efecto para inicializar el formulario cuando hay una transacción
    useEffect(() => {
        if (transaction) {
            // Establecer el display amount
            setDisplayAmount(numberToDisplay(transaction.amount));

            // Encontrar y establecer la cuenta seleccionada
            const account = accounts.find((acc: Account) => acc.title === transaction.account);
            if (account) {
                setSelectedAccountId(account.id);
            }
        } else {
            // Si no hay transacción, establecer valores por defecto
            setDisplayAmount("");
            setSelectedAccountId("");
        }
    }, [transaction, accounts]);

    // Función para manejar el cambio de cuenta
    const handleAccountChange = (accountTitle: string) => {
        const account = accounts.find((acc: Account) => acc.title === accountTitle);
        if (account) {
            setSelectedAccountId(account.id);
        }
        // Limpiar método seleccionado cuando cambie la cuenta
        form.setValue("method", "");
    };

    // Función para manejar el cambio de monto
    const handleAmountChange = (value: string) => {
        const formatted = formatCurrencyInput(value);
        const numericValue = parseDisplayAmount(formatted);

        setDisplayAmount(formatted);
        form.setValue("amount", numericValue);
    };

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const formattedData = {
            ...data,
            date: data.date.toISOString(),
        };

        if (transaction) {
            editTransaction({
                id: transaction.id,
                ...formattedData,
            });
        } else {
            createTransaction({
                id: "",
                ...formattedData,
            });
        }

        setOpenDialog(false);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Descripción</FormLabel>
                            <FormControl>
                                <Input placeholder="Alquiler" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-4">
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem className="flex-1" style={{ flexBasis: '70%' }}>
                                <FormLabel>Monto</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        inputMode="decimal"
                                        placeholder="1.234,56"
                                        value={displayAmount}
                                        onChange={(e) => handleAmountChange(e.target.value)}
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
                            <FormItem className="flex-1" style={{ flexBasis: '30%' }}>
                                <FormLabel>Moneda</FormLabel>
                                <FormControl>
                                    <CustomSelect
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        options={currencyOptions}
                                        placeholder="Moneda"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tipo</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione un tipo de transacción" />
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

                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Categoría</FormLabel>
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
                                        handleAccountChange(value);
                                    }}
                                    value={field.value}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione una cuenta" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {accounts.map((account: Account) => (
                                            <SelectItem key={account.id} value={account.title}>
                                                {account.title}
                                            </SelectItem>
                                        ))}
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
                            <FormLabel>Método de pago</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled={!selectedAccountId}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione un método de pago" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredMethods.map((method: Method) => {
                                            const displayName = method.cardType
                                                ? `${method.title} - ${method.cardType}`
                                                : method.title;
                                            return (
                                                <SelectItem key={method.id} value={displayName}>
                                                    {displayName}
                                                </SelectItem>
                                            );
                                        })}
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
    );
}