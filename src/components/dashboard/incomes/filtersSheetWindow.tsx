import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { getMonthsOfYear } from "@/helpers/getMonthsOfYear";
import { Category } from "@/types/category";
import { Filter } from "lucide-react"
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function FilterSheetWindow() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const locale = useLocale()
    const t = useTranslations("Dashboard.Incomes");
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [options, setOptions] = useState<Category[]>([]);
    const months = getMonthsOfYear(locale)

    useEffect(() => {
        const getCategories = async () => {
            try {
                setIsLoading(true)
                const response = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/category`, { cache: 'no-store', credentials: 'include' }).then((resp) => resp.json())
                const { formattedCategories } = await response
                if (formattedCategories) {
                    setOptions(formattedCategories)
                    setIsLoading(false)
                }

            } catch (error) {
                console.log(error)
            }

        }
        getCategories();
    }, [])

    const updateQueryParams = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams as any);
        if (value === "all") {
            params.delete(key);
        } else {
            params.set(key, value);
        }
        router.push(`?${params.toString()}`);
    };
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline">{t("filterButton")} <Filter /></Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Filtrar por...</SheetTitle>
                    <SheetDescription>
                        Selecciona los filtros que queres aplicar
                    </SheetDescription>
                </SheetHeader>
                <div className="w-full grid gap-8 py-4">
                    <Select
                        onValueChange={(value) => updateQueryParams("type", value)}
                        value={searchParams.get("type") || "all"}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={t("filterType")} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All types</SelectItem>
                            <SelectItem value="expense">Expense</SelectItem>
                            <SelectItem value="income">Income</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        onValueChange={(value) => updateQueryParams("paymentType", value)}
                        value={searchParams.get("paymentType") || "all"}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={t("filterPayment")} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All payment types</SelectItem>
                            <SelectItem value="Credit Card">Credit Card</SelectItem>
                            <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                            <SelectItem value="Debit Card">Debit Card</SelectItem>
                            <SelectItem value="Online Payment">Online Payment</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        onValueChange={(value) => updateQueryParams("category", value)}
                        value={searchParams.get("category") || "all"}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={t("filterCategory")} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All categories</SelectItem>
                            {options.map((option) => (
                                <SelectItem value={option.nombre}>{option.nombre}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        onValueChange={(value) => updateQueryParams("date", value)}
                        value={searchParams.get("date") || "all"}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={t("filterDate")} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Dates</SelectItem>
                            {months.map((month) => (
                                <SelectItem value={month.fecha}>{month.mes}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button type="submit">Listo!</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
