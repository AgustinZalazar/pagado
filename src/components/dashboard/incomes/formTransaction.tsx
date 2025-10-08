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
import { useTranslations } from "next-intl"
import { useSession } from "next-auth/react"
import { useGetUserInfo } from "@/hooks/useUser"

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

// Schema creator function to use translations
const createFormSchema = (t: any) => z.object({
    description: z.string().min(2, {
        message: t('errors.descriptionMin'),
    }),
    amount: z.number().positive({
        message: t('errors.amountPositive')
    }),
    currency: z.string().min(1, { message: t('errors.currencyRequired') }),
    type: z.enum(["income", "expense"], {
        errorMap: () => ({ message: t('errors.typeRequired') })
    }),
    category: z.string().min(1, { message: t('errors.categoryRequired') }),
    date: z.date({ required_error: t('errors.dateRequired') }),
    account: z.string().min(1, { message: t('errors.accountRequired') }),
    method: z.string().min(1, { message: t('errors.methodRequired') }),
});

interface FormProps {
    openDialog: boolean;
    setOpenDialog: Dispatch<SetStateAction<boolean>>;
    transaction?: Transaction;
}

export function FormTransaction({ openDialog, setOpenDialog, transaction }: FormProps) {
    const t = useTranslations('Dashboard.Forms.Transaction');
    const { createTransaction } = useCreateTransaction(setOpenDialog);
    const { editTransaction } = useEditTransaction(setOpenDialog);
    const { accounts } = useGetAccounts();
    const { methods } = useGetMethods();
    const { data: session } = useSession();
    const { user } = useGetUserInfo(session?.user.email as string);

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

    const FormSchema = useMemo(() => createFormSchema(t), [t]);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            description: transaction?.description || "",
            amount: transaction?.amount ? parseFloat(transaction.amount.toString()) : 0,
            currency: transaction?.currency || user?.currency || "",
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
            const numericAmount = parseFloat(transaction.amount.toString());

            // Establecer el display amount
            setDisplayAmount(numberToDisplay(numericAmount));

            // Actualizar el valor en el formulario
            form.setValue("amount", numericAmount);

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
    }, [transaction, accounts, form]);

    // Efecto para establecer la moneda del usuario por defecto
    useEffect(() => {
        if (!transaction && user?.currency && !form.getValues("currency")) {
            form.setValue("currency", user.currency);
        }
    }, [user, transaction, form]);

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
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full xl:w-[600px] space-y-6">
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('description')}</FormLabel>
                            <FormControl>
                                <Input placeholder={t('descriptionPlaceholder')} {...field} />
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
                            <FormItem className="flex-1" style={{ flexBasis: '50%' }}>
                                <FormLabel>{t('amount')}</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        inputMode="decimal"
                                        placeholder={t('amountPlaceholder')}
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
                            <FormItem className="flex-1" style={{ flexBasis: '50%' }}>
                                <FormLabel>{t('currency')}</FormLabel>
                                <FormControl>
                                    <CustomSelect
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        options={currencyOptions}
                                        placeholder={t('currencyPlaceholder')}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem className="flex-1" style={{ flexBasis: '50%' }}>
                                <FormLabel>{t('type')}</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('typePlaceholder')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem className="cursor-pointer hover:bg-gray-100" value="income">{t('typeIncome')}</SelectItem>
                                            <SelectItem className="cursor-pointer hover:bg-gray-100" value="expense">{t('typeExpense')}</SelectItem>
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
                            <FormItem className="flex-1" style={{ flexBasis: '50%' }}>
                                <FormLabel>{t('category')}</FormLabel>
                                <FormControl>
                                    <SearchableColorfulSelect field={field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                {/* Campo Date */}
                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>{t('date')}</FormLabel>
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
                                                <span>{t('datePlaceholder')}</span>
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


                <div className="flex flex-col md:flex-row gap-4">
                    <FormField
                        control={form.control}
                        name="account"
                        render={({ field }) => (
                            <FormItem className="flex-1" style={{ flexBasis: '50%' }}>
                                <FormLabel>{t('account')}</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            handleAccountChange(value);
                                        }}
                                        value={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('accountPlaceholder')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {accounts.map((account: Account) => (
                                                <SelectItem className="cursor-pointer hover:bg-gray-100" key={account.id} value={account.title}>
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
                            <FormItem className="flex-1" style={{ flexBasis: '50%' }}>
                                <FormLabel>{t('method')}</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        disabled={!selectedAccountId}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('methodPlaceholder')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {filteredMethods.map((method: Method) => {
                                                const displayName = method.cardType
                                                    ? `${method.title} - ${method.cardType}`
                                                    : method.title;
                                                return (
                                                    <SelectItem className="cursor-pointer hover:bg-gray-100" key={method.id} value={displayName}>
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
                </div>
                <Button type="submit">{t('save')}</Button>
            </form>
        </Form>
    );
}