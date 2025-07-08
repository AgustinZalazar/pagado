"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, DollarSign, CreditCard, PiggyBank } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useCurrency } from "./currency-context"
import { useLanguage } from "./language-context"

export function DashboardPreview() {
    const [isVisible, setIsVisible] = useState(false)
    const { formatAmount } = useCurrency()
    const { t } = useLanguage()
    const [animatedValues, setAnimatedValues] = useState({
        balance: 0,
        income: 0,
        expenses: 0,
        savings: 0,
    })

    useEffect(() => {
        setIsVisible(true)

        // Animate numbers counting up
        const timer = setTimeout(() => {
            setAnimatedValues({
                balance: 12450,
                income: 5200,
                expenses: 3100,
                savings: 2800,
            })
        }, 500)

        return () => clearTimeout(timer)
    }, [])

    const transactions = [
        {
            id: 1,
            description: t("transaction.supermarket"),
            amount: -67.43,
            category: t("category.food"),
            time: t("time.hours.ago"),
        },
        {
            id: 2,
            description: t("transaction.salary"),
            amount: 2600,
            category: t("category.income"),
            time: t("time.day.ago"),
        },
        {
            id: 3,
            description: t("transaction.netflix"),
            amount: -15.99,
            category: t("category.entertainment"),
            time: t("time.days.ago.2"),
        },
        {
            id: 4,
            description: t("transaction.gas"),
            amount: -45.2,
            category: t("category.transport"),
            time: t("time.days.ago.3"),
        },
    ]

    return (
        <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-2xl border mx-2 sm:mx-0">
                {/* Dashboard Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
                    <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-800">{t("dashboard.title")}</h3>
                        <p className="text-sm sm:text-base text-slate-600">{t("dashboard.welcome")}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-400 rounded-full animate-pulse"></div>
                        <span className="text-xs sm:text-sm text-slate-600">{t("dashboard.sync")}</span>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
                    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-2 sm:p-4">
                            <CardTitle className="text-xs sm:text-sm font-medium">{t("dashboard.total.balance")}</CardTitle>
                            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent className="p-2 sm:p-4 pt-0">
                            <div className="text-sm sm:text-2xl font-bold text-blue-600">{formatAmount(animatedValues.balance)}</div>
                            <p className="text-xs text-muted-foreground flex items-center mt-1">
                                <TrendingUp className="h-2 w-2 sm:h-3 sm:w-3 mr-1 text-blue-500" />
                                <span className="hidden sm:inline">+12% desde el mes pasado</span>
                                <span className="sm:hidden">+12%</span>
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-2 sm:p-4">
                            <CardTitle className="text-xs sm:text-sm font-medium">{t("dashboard.monthly.income")}</CardTitle>
                            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-600" />
                        </CardHeader>
                        <CardContent className="p-2 sm:p-4 pt-0">
                            <div className="text-sm sm:text-2xl font-bold text-cyan-600">{formatAmount(animatedValues.income)}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                <span className="hidden sm:inline">En camino para este mes</span>
                                <span className="sm:hidden">Este mes</span>
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-2 sm:p-4">
                            <CardTitle className="text-xs sm:text-sm font-medium">{t("dashboard.monthly.expenses")}</CardTitle>
                            <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-600" />
                        </CardHeader>
                        <CardContent className="p-2 sm:p-4 pt-0">
                            <div className="text-sm sm:text-2xl font-bold text-indigo-600">
                                {formatAmount(animatedValues.expenses)}
                            </div>
                            <p className="text-xs text-muted-foreground flex items-center mt-1">
                                <TrendingDown className="h-2 w-2 sm:h-3 sm:w-3 mr-1 text-indigo-500" />
                                <span className="hidden sm:inline">-5% desde el mes pasado</span>
                                <span className="sm:hidden">-5%</span>
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-2 sm:p-4">
                            <CardTitle className="text-xs sm:text-sm font-medium">{t("dashboard.savings")}</CardTitle>
                            <PiggyBank className="h-3 w-3 sm:h-4 sm:w-4 text-blue-700" />
                        </CardHeader>
                        <CardContent className="p-2 sm:p-4 pt-0">
                            <div className="text-sm sm:text-2xl font-bold text-blue-700">{formatAmount(animatedValues.savings)}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                <span className="hidden sm:inline">Meta fondo emergencia: 70%</span>
                                <span className="sm:hidden">Meta: 70%</span>
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* Budget Progress */}
                    <Card className="hover:shadow-lg transition-all duration-300">
                        <CardHeader className="p-3 sm:p-4">
                            <CardTitle className="flex items-center text-sm sm:text-base">{t("dashboard.budget.summary")}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4 pt-0">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs sm:text-sm">
                                    <span>{t("budget.food.restaurants")}</span>
                                    <span>
                                        {formatAmount(420)} / {formatAmount(500)}
                                    </span>
                                </div>
                                <Progress value={84} className="h-1.5 sm:h-2" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs sm:text-sm">
                                    <span>{t("budget.transport")}</span>
                                    <span>
                                        {formatAmount(180)} / {formatAmount(300)}
                                    </span>
                                </div>
                                <Progress value={60} className="h-1.5 sm:h-2" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs sm:text-sm">
                                    <span>{t("budget.entertainment")}</span>
                                    <span>
                                        {formatAmount(95)} / {formatAmount(200)}
                                    </span>
                                </div>
                                <Progress value={47} className="h-1.5 sm:h-2" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Transactions */}
                    <Card className="hover:shadow-lg transition-all duration-300">
                        <CardHeader className="p-3 sm:p-4">
                            <CardTitle className="text-sm sm:text-base">{t("dashboard.recent.transactions")}</CardTitle>
                            <CardDescription className="text-xs sm:text-sm">{t("dashboard.bot.activity")}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-3 sm:p-4 pt-0">
                            <div className="space-y-2 sm:space-y-3">
                                {transactions.map((transaction, index) => (
                                    <div
                                        key={transaction.id}
                                        className={`flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-all duration-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                                            }`}
                                        style={{
                                            transitionDelay: `${index * 100 + 800}ms`,
                                            animation: isVisible ? `slideInRight 0.5s ease-out ${index * 0.1 + 0.8}s both` : "none",
                                        }}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-xs sm:text-sm truncate">{transaction.description}</p>
                                            <p className="text-xs text-muted-foreground">{transaction.time}</p>
                                        </div>
                                        <div className="text-right ml-2">
                                            <p
                                                className={`font-semibold text-xs sm:text-sm ${transaction.amount > 0 ? "text-blue-600" : "text-indigo-600"}`}
                                            >
                                                {transaction.amount > 0 ? "+" : ""}
                                                {formatAmount(Math.abs(transaction.amount))}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{transaction.category}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Floating WhatsApp Indicator */}
                <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-blue-500 text-white p-2 sm:p-3 rounded-full shadow-lg animate-bounce">
                    <div className="w-4 h-4 sm:w-6 sm:h-6 bg-white rounded-full flex items-center justify-center">
                        <span className="text-blue-500 text-xs font-bold">💬</span>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
        </div>
    )
}
