import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { changePercentage } from "@/helpers/calculatePercentage"
import { SummaryCategory } from "@/types/category"
import { OtherCurrencies } from "@/types/Currency"
import { SummaryMethod } from "@/types/PaymentMethod"
import NumberFlow from "@number-flow/react"
import { CircleDollarSign, TrendingDown, TrendingUp } from 'lucide-react'
import { useLocale, useTranslations } from "next-intl"
import { getLocale } from "next-intl/server"
import HoverCardsTemplate from "../hoverCards"

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
    const locale = useLocale()
    const incomePercentage = changePercentage(totalIncome, totalLastIncome);
    const expensePercentage = changePercentage(totalExpenses, totalLastExpense);


    console.log(otherCurrencies)
    return (
        <div className="flex flex-col md:flex-row gap-4">
            <Card className="drop-shadow-md w-full md:w-[25%] h-[142px]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-medium text-muted-foreground">{t('card1')}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-start">
                    <div className="w-full flex justify-between">
                        <div className="flex gap-x-3">
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
                            {!incomePercentage.includes("-") ?
                                <div className="flex bg-badge_light_green rounded-xl h-fit py-0.5 px-2">
                                    <TrendingUp className="h-3 w-3  text-badge_text_green mr-1" />
                                    <p className="text-xs text-badge_text_green">{incomePercentage}</p>
                                </div>
                                :
                                <div className="flex bg-badge_light_red rounded-xl h-fit py-0.5 px-2">
                                    <TrendingDown className="h-3 w-3 text-badge_text_red mr-1" />
                                    <p className="text-xs text-badge_text_red ">{incomePercentage}</p>
                                </div>
                            }
                        </div>
                        <HoverCardsTemplate isTransactions={true}>
                            {Object.entries(otherCurrencies.current).map(([currency, totals]) => (
                                <div key={currency} className="mb-2">
                                    <p><strong>{currency}</strong> - {totals.income}</p>
                                </div>
                            ))}
                        </HoverCardsTemplate>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Mes Pasado</p>
                        <NumberFlow
                            className="text-black text-sm font-semibold"
                            value={+totalLastIncome}
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
                </CardContent>
            </Card>
            <Card className="drop-shadow-md w-full md:w-[25%] h-[142px]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-medium text-muted-foreground">{t('card2')}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-start">
                    <div className="flex w-full justify-between">
                        <div className="flex gap-x-3">
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
                            {expensePercentage.includes("-") ?
                                <div className="flex bg-badge_light_green rounded-xl h-fit py-0.5 px-2">
                                    <TrendingDown className="h-3 w-3  text-badge_text_green mr-1" />
                                    <p className="text-xs text-badge_text_green">{expensePercentage}</p>
                                </div>
                                :
                                <div className="flex bg-badge_light_red rounded-xl h-fit py-0.5 px-2">
                                    <TrendingUp className="h-3 w-3 text-badge_text_red mr-1" />
                                    <p className="text-xs text-badge_text_red ">{expensePercentage}</p>
                                </div>
                            }

                        </div>
                        <HoverCardsTemplate isTransactions={true}>
                            {Object.entries(otherCurrencies.current).map(([currency, totals]) => (
                                <div key={currency} className="mb-2">
                                    <p><strong>{currency}</strong> - {totals.expenses}</p>
                                </div>
                            ))}

                        </HoverCardsTemplate>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Mes Pasado</p>
                        <NumberFlow
                            className="text-black text-sm font-semibold"
                            value={+totalLastExpense}
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
                </CardContent>
            </Card>
            <Card className="drop-shadow-md w-full md:w-[25%] h-[142px]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-medium text-muted-foreground">{t('card3')}</CardTitle>
                    {totalCategory &&
                        <p className="text-xs font-medium text-muted-foreground bg-gray-200 px-2 rounded-full">{totalCategory.currentMonth.category}</p>
                    }
                </CardHeader>
                <CardContent className="flex flex-col items-start">
                    <div className="flex gap-x-3">
                        <NumberFlow
                            className="text-2xl font-bold text-black relative -top-1"
                            value={totalCat}
                            format={{
                                style: "currency",
                                currency: "ARS",
                                minimumFractionDigits: 0,
                            }}
                            transformTiming={{
                                duration: 500,
                                easing: "ease-out",
                            }}
                        />
                        {totalCategory && totalCategory.percentage.includes("-") ?
                            <div className="flex bg-badge_light_green rounded-xl h-fit py-0.5 px-2">
                                <TrendingDown className="h-3 w-3  text-badge_text_green mr-1" />
                                <p className="text-xs text-badge_text_green">{totalCategory ? totalCategory.percentage : "%0"}</p>
                            </div>
                            :
                            <div className="flex bg-badge_light_red rounded-xl h-fit py-0.5 px-2">
                                <TrendingUp className="h-3 w-3 text-badge_text_red mr-1" />
                                <p className="text-xs text-badge_text_red ">{totalCategory ? totalCategory.percentage : "%0"}</p>
                            </div>
                        }
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Mes Pasado</p>
                        <div className="flex items-center gap-2">
                            {totalCategory &&
                                <>
                                    <NumberFlow
                                        className="text-black text-sm font-semibold"
                                        value={+totalCategory.previousMonth.total}
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
                                    <p className="text-black text-xs font-semibold"> &#10088;{totalCategory.previousMonth.category}&#10089;</p>
                                </>
                            }
                        </div>
                    </div>


                </CardContent>
            </Card>
            <Card className="drop-shadow-md w-full md:w-[25%] h-[142px]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-medium text-muted-foreground">{t('card4')}</CardTitle>
                    {totalMethod &&
                        <p className="text-xs font-medium text-muted-foreground bg-gray-200 px-2 rounded-full">{totalMethod.currentMonth.method}</p>
                    }
                </CardHeader>
                <CardContent className="flex items-start flex-col">
                    <div className="flex gap-x-3">
                        <NumberFlow
                            className="text-2xl font-bold text-black relative -top-1"
                            value={totalMetCurrentMonth}
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
                        {totalMethod && totalMethod.percentage.includes("-") ?
                            <div className="flex bg-badge_light_green rounded-xl h-fit py-0.5 px-2">
                                <TrendingDown className="h-3 w-3  text-badge_text_green mr-1" />
                                <p className="text-xs text-badge_text_green">{totalMethod ? totalMethod.percentage : "%0"}</p>
                            </div>
                            :
                            <div className="flex bg-badge_light_red rounded-xl h-fit py-0.5 px-2">
                                <TrendingUp className="h-3 w-3 text-badge_text_red mr-1" />
                                <p className="text-xs text-badge_text_red ">{totalMethod ? totalMethod.percentage : "%0"}</p>
                            </div>
                        }
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Mes Pasado</p>
                        <div className="flex items-center gap-2">
                            {totalMethod &&
                                <>
                                    <NumberFlow
                                        className="text-black text-sm font-semibold"
                                        value={+totalMethod.previousMonth.total}
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
                                    <p className="text-black text-xs font-semibold"> &#10088;{totalMethod.previousMonth.method}&#10089;</p>
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