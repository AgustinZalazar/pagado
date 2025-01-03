import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign } from 'lucide-react'
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
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${totalIncome.toFixed(2)}</div>
                </CardContent>
            </Card>
            <Card className="drop-shadow-md w-full md:w-[260px]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t('card2')}</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
                </CardContent>
            </Card>
        </div>
    )
}