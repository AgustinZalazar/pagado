import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { changePercentage } from "@/helpers/calculatePercentage"
import { SummaryCategory } from "@/types/category"
import { OtherCurrencies } from "@/types/Currency"
import { SummaryMethod } from "@/types/PaymentMethod"
import NumberFlow from "@number-flow/react"
import { CircleDollarSign, TrendingDown, TrendingUp } from 'lucide-react'
import { useTranslations } from "next-intl"
// import { getLocale } from "next-intl/server"
// import HoverCardsTemplate from "../hoverCards"
// import { renderFormattedAmount } from "@/helpers/formatAmount"
// import { cn } from "@/lib/utils"

type SummaryCardsProps = {
    totalIncome: number
    totalExpenses: number
    totalCategory: SummaryCategory
    totalMethod: SummaryMethod
    totalCat: number
    totalMetCurrentMonth: number
    totalLastExpense: number
    totalLastIncome: number
    otherCurrencies: OtherCurrencies
}

export function SummaryCards({ totalIncome = 0, totalExpenses = 0, totalCategory, totalMethod, totalCat, totalMetCurrentMonth, totalLastExpense, totalLastIncome, otherCurrencies }: SummaryCardsProps) {
    const t = useTranslations('Dashboard.Incomes');
    // const locale = useLocale()
    const incomePercentage = changePercentage(totalIncome, totalLastIncome);
    const expensePercentage = changePercentage(totalExpenses, totalLastExpense);
    const nonZeroIncomeCurrencies = Object.entries(otherCurrencies.current)
        .filter(([, totals]) => totals.income !== 0);

    const nonZeroExpensesCurrencies = Object.entries(otherCurrencies.current)
        .filter(([, totals]) => totals.expenses !== 0);

    return (
        <div className="flex flex-col md:flex-row gap-4">
            {/* CARD 1 - Ingresos */}
            <Card className="drop-shadow-md w-full md:w-[25%] h-[142px]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-medium text-muted-foreground">{t('card1')}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-start">
                    <div className="flex gap-x-3">
                        <NumberFlow
                            className={`text-2xl font-bold relative -top-1 ${!incomePercentage.includes("-") ? "text-green-600" : "text-red-600"
                                }`}
                            value={+totalIncome.toFixed(0)}
                            format={{ style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }}
                            transformTiming={{ duration: 500, easing: 'ease-out' }}
                        />
                        {!incomePercentage.includes("-") ? (
                            <div className="flex bg-green-100 dark:bg-green-900 rounded-xl h-fit py-0.5 px-2">
                                <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400 mr-1" />
                                <p className="text-xs text-green-600 dark:text-green-400">{incomePercentage}</p>
                            </div>
                        ) : (
                            <div className="flex bg-red-100 dark:bg-red-900 rounded-xl h-fit py-0.5 px-2">
                                <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400 mr-1" />
                                <p className="text-xs text-red-600 dark:text-red-400">{incomePercentage}</p>
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">{t("lastMonth")}</p>
                        <NumberFlow
                            className="text-black dark:text-white text-sm font-semibold"
                            value={+totalLastIncome}
                            format={{ style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }}
                            transformTiming={{ duration: 500, easing: 'ease-out' }}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* CARD 2 - Gastos */}
            <Card className="drop-shadow-md w-full md:w-[25%] h-[142px]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-medium text-muted-foreground">{t('card2')}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-start">
                    <div className="flex gap-x-3">
                        <NumberFlow
                            className={`text-2xl font-bold relative -top-1 ${expensePercentage.includes("-") ? "text-green-600" : "text-red-600"
                                }`}
                            value={+totalExpenses}
                            format={{ style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }}
                            transformTiming={{ duration: 500, easing: 'ease-out' }}
                        />
                        {expensePercentage.includes("-") ? (
                            <div className="flex bg-green-100 dark:bg-green-900 rounded-xl h-fit py-0.5 px-2">
                                <TrendingDown className="h-3 w-3 text-green-600 dark:text-green-400 mr-1" />
                                <p className="text-xs text-green-600 dark:text-green-400">{expensePercentage}</p>
                            </div>
                        ) : (
                            <div className="flex bg-red-100 dark:bg-red-900 rounded-xl h-fit py-0.5 px-2">
                                <TrendingUp className="h-3 w-3 text-red-600 dark:text-red-400 mr-1" />
                                <p className="text-xs text-red-600 dark:text-red-400">{expensePercentage}</p>
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">{t("lastMonth")}</p>
                        <NumberFlow
                            className="text-black dark:text-white text-sm font-semibold"
                            value={+totalLastExpense}
                            format={{ style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }}
                            transformTiming={{ duration: 500, easing: 'ease-out' }}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* CARD 3 - Categorías */}
            <Card className="drop-shadow-md w-full md:w-[25%] h-[142px]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-medium text-muted-foreground">{t('card3')}</CardTitle>
                    {totalCategory &&
                        <p className="text-xs font-medium text-muted-foreground bg-gray-200 dark:bg-gray-800 px-2 rounded-full">{totalCategory.currentMonth.category}</p>
                    }
                </CardHeader>
                <CardContent className="flex flex-col items-start">
                    <div className="flex gap-x-3">
                        <NumberFlow
                            className={`text-2xl font-bold relative -top-1 ${totalCategory && totalCategory.percentage.includes("-")
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                                }`}
                            value={totalCat}
                            format={{ style: "currency", currency: "ARS", minimumFractionDigits: 0 }}
                            transformTiming={{ duration: 500, easing: "ease-out" }}
                        />
                        {totalCategory && (
                            totalCategory.percentage.includes("-") ? (
                                <div className="flex bg-green-100 dark:bg-green-900 rounded-xl h-fit py-0.5 px-2">
                                    <TrendingDown className="h-3 w-3 text-green-600 dark:text-green-400 mr-1" />
                                    <p className="text-xs text-green-600 dark:text-green-400">{totalCategory.percentage}</p>
                                </div>
                            ) : (
                                <div className="flex bg-red-100 dark:bg-red-900 rounded-xl h-fit py-0.5 px-2">
                                    <TrendingUp className="h-3 w-3 text-red-600 dark:text-red-400 mr-1" />
                                    <p className="text-xs text-red-600 dark:text-red-400">{totalCategory.percentage}</p>
                                </div>
                            )
                        )}
                    </div>

                    <div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">{t("lastMonth")}</p>
                        <div className="flex items-center gap-2">
                            {totalCategory && (
                                <>
                                    <NumberFlow
                                        className="text-neutral-900 dark:text-neutral-100 text-sm font-semibold"
                                        value={+totalCategory.previousMonth.total}
                                        format={{ style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }}
                                        transformTiming={{ duration: 500, easing: 'ease-out' }}
                                    />
                                    <p className="text-neutral-900 dark:text-neutral-100 text-xs font-semibold">
                                        &#10088;{totalCategory.previousMonth.category}&#10089;
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* CARD 4 - Métodos */}
            <Card className="drop-shadow-md w-full md:w-[25%] h-[142px]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-medium text-muted-foreground">{t('card4')}</CardTitle>
                    {totalMethod &&
                        <p className="text-xs font-medium text-muted-foreground bg-gray-200 dark:bg-gray-800 px-2 rounded-full">{totalMethod.currentMonth.method}</p>
                    }
                </CardHeader>
                <CardContent className="flex items-start flex-col">
                    <div className="flex gap-x-3">
                        <NumberFlow
                            className={`text-2xl font-bold relative -top-1 ${totalMethod?.percentage.includes("-") ? "text-green-600" : "text-red-600"
                                }`}
                            value={totalMetCurrentMonth}
                            format={{ style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }}
                            transformTiming={{ duration: 500, easing: 'ease-out' }}
                        />
                        {totalMethod && (
                            totalMethod.percentage.includes("-") ? (
                                <div className="flex bg-green-100 dark:bg-green-900 rounded-xl h-fit py-0.5 px-2">
                                    <TrendingDown className="h-3 w-3 text-green-600 dark:text-green-400 mr-1" />
                                    <p className="text-xs text-green-600 dark:text-green-400">{totalMethod.percentage}</p>
                                </div>
                            ) : (
                                <div className="flex bg-red-100 dark:bg-red-900 rounded-xl h-fit py-0.5 px-2">
                                    <TrendingUp className="h-3 w-3 text-red-600 dark:text-red-400 mr-1" />
                                    <p className="text-xs text-red-600 dark:text-red-400">{totalMethod.percentage}</p>
                                </div>
                            ))}
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">{t("lastMonth")}</p>
                        <div className="flex items-center gap-2">
                            {totalMethod &&
                                <>
                                    <NumberFlow
                                        className="text-black dark:text-white text-sm font-semibold"
                                        value={+totalMethod.previousMonth.total}
                                        format={{ style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }}
                                        transformTiming={{ duration: 500, easing: 'ease-out' }}
                                    />
                                    <p className="text-black dark:text-white text-xs font-semibold"> &#10088;{totalMethod.previousMonth.method}&#10089;</p>
                                </>
                            }
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}


const EmptyCard = () => {
    return (
        <>
            <div className="flex gap-x-3">
                <NumberFlow
                    className="text-2xl font-bold text-black relative -top-1"
                    value={0}
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
            </div>
            <div>
                <p className="text-xs text-muted-foreground">Mes Pasado</p>
                <p className="text-black text-xs font-semibold">$0  &#10088;-&#10089;</p>
            </div>
        </>
    )
}