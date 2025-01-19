import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import NumberFlow from "@number-flow/react"
import { DollarSign, TrendingDown, TrendingUp } from 'lucide-react'
import { useLocale, useTranslations } from "next-intl"
import { getLocale } from "next-intl/server"

type SummaryCardsProps = {
    totalIncome: number
    totalExpenses: number
    totalCategory: number
    totalMethod: number
}

export function SummaryCards({ totalIncome = 0, totalExpenses = 0, totalCategory = 0, totalMethod = 0 }: SummaryCardsProps) {
    const t = useTranslations('Dashboard.Incomes');
    const locale = useLocale()
    const formatCurrency = (value: number) =>
        new Intl.NumberFormat(locale, {
            style: "currency",
            currency: "ARS",
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
        }).format(value);
    return (
        <div className="flex flex-col md:flex-row gap-4">
            <Card className="drop-shadow-md w-full md:w-[382px] h-[142px]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-medium text-muted-foreground">{t('card1')}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-start">
                    <div className="flex gap-x-3">
                        {/* <div className="text-2xl font-bold text-black relative -top-1">${formatCurrency(+totalIncome.toFixed(0))}</div> */}
                        <NumberFlow
                            className="text-2xl font-bold text-black relative -top-1"
                            value={+totalIncome.toFixed(0)}
                            format={{
                                style: 'currency',
                                currency: 'ARS',
                                minimumFractionDigits: 0
                            }}
                            transformTiming={{
                                duration: 500,
                                easing: 'ease-out'
                            }}
                        />
                        <div className="flex bg-badge_light_green rounded-xl h-fit py-0.5 px-2">
                            <TrendingUp className="h-3 w-3 text-badge_text_green" />
                            <p className="text-xs text-badge_text_green">+3%</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Mes Pasado</p>
                        <p className="text-black text-sm font-semibold">$1.500.000</p>
                    </div>
                </CardContent>
            </Card>
            <Card className="drop-shadow-md w-full md:w-[382px] h-[142px]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-medium text-muted-foreground">{t('card2')}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-start">
                    <div className="flex gap-x-3">
                        {/* <div className="text-2xl font-bold text-black relative -top-1">${formatCurrency(+totalExpenses)}</div> */}
                        <NumberFlow
                            className="text-2xl font-bold text-black relative -top-1"
                            value={+totalExpenses}
                            format={{
                                style: 'currency',
                                currency: 'ARS',
                                minimumFractionDigits: 0
                            }}
                            transformTiming={{
                                duration: 500,
                                easing: 'ease-out'
                            }}
                        />
                        <div className="flex bg-badge_light_red rounded-xl h-fit py-0.5 px-2">
                            <TrendingDown className="h-3 w-3 text-badge_text_red" />
                            <p className="text-xs text-badge_text_red">+3%</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Mes Pasado</p>
                        <p className="text-black text-sm font-semibold">$200</p>
                    </div>
                </CardContent>
            </Card>
            <Card className="drop-shadow-md w-full md:w-[400px] h-[142px]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-medium text-muted-foreground">{t('card3')}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-start">
                    <div className="flex gap-x-3">
                        {/* <div className="text-2xl font-bold text-black relative -top-1">${formatCurrency(+totalCategory)}</div> */}
                        <NumberFlow
                            className="text-2xl font-bold text-black relative -top-1"
                            value={+totalCategory}
                            format={{
                                style: 'currency',
                                currency: 'ARS',
                                minimumFractionDigits: 0
                            }}
                            transformTiming={{
                                duration: 500,
                                easing: 'ease-out'
                            }}
                        />
                        <div className="flex bg-badge_light_red rounded-xl h-fit py-0.5 px-2">
                            <TrendingDown className="h-3 w-3 text-badge_text_red" />
                            <p className="text-xs text-badge_text_red">+3%</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Mes Pasado</p>
                        <p className="text-black text-xs font-semibold">$200 &#10088;Entretenimiento&#10089;</p>
                    </div>
                </CardContent>
            </Card>
            <Card className="drop-shadow-md w-full md:w-[400px] h-[142px]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-medium text-muted-foreground">{t('card4')}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-start flex-col">
                    <div className="flex gap-x-3">
                        {/* <div className="text-2xl font-bold text-black relative -top-1">${formatCurrency(+totalMethod)}</div> */}
                        <NumberFlow
                            className="text-2xl font-bold text-black relative -top-1"
                            value={+totalMethod}
                            format={{
                                style: 'currency',
                                currency: 'ARS',
                                minimumFractionDigits: 0
                            }}
                            transformTiming={{
                                duration: 500,
                                easing: 'ease-out'
                            }}
                        />
                        <div className="flex bg-badge_light_red rounded-xl h-fit py-0.5 px-2">
                            <TrendingDown className="h-3 w-3 text-badge_text_red" />
                            <p className="text-xs text-badge_text_red">+3%</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Mes Pasado</p>
                        <p className="text-black text-xs font-semibold">$200 &#10088;Tarjeta de credito&#10089;</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}