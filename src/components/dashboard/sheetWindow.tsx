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
import { Filter } from "lucide-react"
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";

export function SheetWindow() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const t = useTranslations("Dashboard.Incomes");

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
                <Button variant="outline">Filtrar <Filter /></Button>
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
                            <SelectItem value="Entertainment">Entertainment</SelectItem>
                            <SelectItem value="Work">Work</SelectItem>
                            <SelectItem value="Food">Food</SelectItem>
                            <SelectItem value="Utilities">Utilities</SelectItem>
                            <SelectItem value="Salary">Salary</SelectItem>
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
                            <SelectItem value="2023-12-01">December 2023</SelectItem>
                            <SelectItem value="2024-01-01">January 2024</SelectItem>
                            <SelectItem value="2024-12-01">December 2024</SelectItem>
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
