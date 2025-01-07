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
            <Card className="drop-shadow-md w-full md:w-[382px] h-fit">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-medium text-muted-foreground">{t('card1')}</CardTitle>
                </CardHeader>
                <CardContent className="">
                    <div className="flex gap-3 items-start">
                        <div className="text-2xl font-bold text-black relative -top-1">${totalIncome.toFixed(2)}</div>
                        <div className="flex bg-badge_light_green rounded-xl h-fit py-0.5 px-2">
                            <TrendingUp className="h-3 w-3 text-badge_text_green" />
                            <p className="text-xs text-badge_text_green">+3%</p>
                        </div>
                        <div className="ml-auto">
                            <p className="text-xs text-muted-foreground">Mes Pasado</p>
                            <p className="text-black text-sm font-semibold">$200</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="drop-shadow-md w-full md:w-[382px] h-fit">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-medium text-muted-foreground">{t('card2')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-3 items-start">
                        <div className="text-2xl font-bold text-black relative -top-1">${totalExpenses.toFixed(2)}</div>
                        <div className="flex bg-badge_light_red rounded-xl h-fit py-0.5 px-2">
                            <TrendingDown className="h-3 w-3 text-badge_text_red" />
                            <p className="text-xs text-badge_text_red">+3%</p>
                        </div>
                        <div className="ml-auto">
                            <p className="text-xs text-muted-foreground">Mes Pasado</p>
                            <p className="text-black text-sm font-semibold">$200</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="drop-shadow-md w-full md:w-[400px] h-fit">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-medium text-muted-foreground">{t('card3')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-3 items-start">
                        <div className="text-2xl font-bold text-black relative -top-1">${totalExpenses.toFixed(2)}</div>
                        <div className="flex bg-badge_light_red rounded-xl h-fit py-0.5 px-2">
                            <TrendingDown className="h-3 w-3 text-badge_text_red" />
                            <p className="text-xs text-badge_text_red">+3%</p>
                        </div>
                        <div className="ml-auto">
                            <p className="text-xs text-muted-foreground">Mes Pasado</p>
                            <p className="text-black text-xs font-semibold">$200 &#10088;Entretenimiento&#10089;</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="drop-shadow-md w-full md:w-[400px] h-fit">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-medium text-muted-foreground">{t('card3')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-3 items-start">
                        <div className="text-2xl font-bold text-black relative -top-1">${totalExpenses.toFixed(2)}</div>
                        <div className="flex bg-badge_light_red rounded-xl h-fit py-0.5 px-2">
                            <TrendingDown className="h-3 w-3 text-badge_text_red" />
                            <p className="text-xs text-badge_text_red">+3%</p>
                        </div>
                        <div className="ml-auto">
                            <p className="text-xs text-muted-foreground">Mes Pasado</p>
                            <p className="text-black text-xs font-semibold">$200 &#10088;Tarjeta de credito&#10089;</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}