"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Category } from "@/types/category";
import { getMonthsOfYear } from "@/helpers/getMonthsOfYear";

export interface FilterControlsProps {
    onFilterChange: (filters: Record<string, string>) => void;
}

export const FilterControls = ({ onFilterChange }: FilterControlsProps) => {
    const router = useRouter();
    const locale = useLocale()
    const searchParams = useSearchParams();
    const t = useTranslations("Dashboard.Incomes");
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [options, setOptions] = useState<Category[]>([]);
    const months = getMonthsOfYear(locale)

    console.log(months)

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
        onFilterChange(Object.fromEntries(params));
    };

    return (
        <div className="w-[80%] flex flex-wrap items-center gap-3">
            <Input
                placeholder={t("inputSearch")}
                value={searchParams.get("description") || ""}
                onChange={(event) => updateQueryParams("description", event.target.value)}
                className="max-w-sm"
            />
            <Select
                onValueChange={(value) => updateQueryParams("type", value)}
                value={searchParams.get("type") || "all"}
            >
                <SelectTrigger className="w-[180px]">
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
                <SelectTrigger className="w-[180px]">
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
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t("filterCategory")} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {options.map((option) => (
                        <SelectItem key={option.id} value={option.nombre}>{option.nombre}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select
                onValueChange={(value) => updateQueryParams("date", value)}
                value={searchParams.get("date") || "all"}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t("filterDate")} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    {months.map((month) => (
                        <SelectItem key={month.mes} value="2023-12-01">{month.mes}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};
