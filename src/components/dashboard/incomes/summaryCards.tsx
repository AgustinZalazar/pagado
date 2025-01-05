import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { DollarSign, TrendingDown, TrendingUp } from 'lucide-react'
import { useTranslations } from "next-intl"

type SummaryCardsProps = {
    totalIncome: number
    totalExpenses: number
}

export function SummaryCards({ totalIncome, totalExpenses }: SummaryCardsProps) {
    const t = useTranslations('Dashboard.Incomes');
    return (
        <div className="flex flex-col md:flex-row gap-4">
            <Card className="drop-shadow-md w-full md:w-[260px]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t('card1')}</CardTitle>
                    {/* <DollarSign className="h-4 w-4 text-muted-foreground" /> */}
                    <TrendingUp className="h-4 w-4 text-[#00b743]" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-[#00b743]">${totalIncome.toFixed(2)}</div>
                    <Separator className="mt-3" />
                    <p className="mt-3 text-gray-400 text-sm">Mes anterior: <span className="font-semibold text-gray-500">$500</span></p>
                </CardContent>
            </Card>
            <Card className="drop-shadow-md w-full md:w-[260px]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t('card2')}</CardTitle>
                    {/* <DollarSign className="h-4 w-4 text-muted-foreground" /> */}
                    <TrendingDown className="h-4 w-4 text-[#f95353]" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-[#f95353]">${totalExpenses.toFixed(2)}</div>
                    <Separator className="mt-3" />
                    <p className="mt-3 text-gray-400 text-sm">Mes anterior: <span className="font-semibold text-gray-500">$300</span></p>
                </CardContent>
            </Card>
            <Card className="drop-shadow-md w-full md:w-[260px]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t('card3')}</CardTitle>
                    {/* <DollarSign className="h-4 w-4 text-muted-foreground" /> */}
                    <TrendingDown className="h-4 w-4 text-[#f95353]" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-[#f95353]">${totalExpenses.toFixed(2)}<br /><span className="text-sm"></span></div>
                    <p className="text-sm font-bold text-black">Entretenimiento</p>
                    <Separator className="mt-3" />
                    <p className="mt-3 text-gray-400 text-sm">Mes anterior: <br /><span className="font-semibold text-gray-500">Comida&#10088;$250&#10089;</span></p>
                </CardContent>
            </Card>
            <Card className="drop-shadow-md w-full md:w-[260px]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t('card4')}</CardTitle>
                    {/* <DollarSign className="h-4 w-4 text-muted-foreground" /> */}
                    <TrendingDown className="h-4 w-4 text-[#f95353]" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-[#f95353]">${totalExpenses.toFixed(2)}  <span className="text-[10px]">&#10088;Tarjeta de credito&#10089;</span></div>
                    {/* <p className="text-sm font-bold text-black">Tarjeta de credito</p> */}
                    <Separator className="mt-3" />
                    <p className="mt-3 text-gray-400 text-sm">Mes anterior: <br /><span className="font-semibold text-gray-500">Tarjeta de debito&#10088;$300&#10089;</span></p>
                </CardContent>
            </Card>
        </div>
    )
}