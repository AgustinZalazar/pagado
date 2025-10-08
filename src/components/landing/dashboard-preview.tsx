"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, DollarSign, CreditCard, PiggyBank, Target } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

    const monthlyData = [
        { month: "Ene", income: 10800, expense: 2800 },
        { month: "Feb", income: 4500, expense: 3200 },
        { month: "Mar", income: 5100, expense: 4100 },
        { month: "Abr", income: 3900, expense: 2400 },
        { month: "May", income: 4700, expense: 2600 },
        { month: "Jun", income: 5000, expense: 2900 },
        { month: "Jul", income: 5300, expense: 7200 },
        { month: "Ago", income: 5800, expense: 2700 },
        { month: "Sep", income: 4600, expense: 2800 },
        { month: "Oct", income: 9400, expense: 6400 },
        { month: "Nov", income: 5200, expense: 3100 },
        { month: "Dic", income: 0, expense: 0 },
    ]

    const maxIncome = Math.max(...monthlyData.map((d) => d.income))
    const maxExpense = Math.max(...monthlyData.map((d) => d.expense))

    const categories = [
        { name: "Regalos", amount: 360000, percentage: 52.3, color: "bg-blue-400", textColor: "text-blue-500", icon: "🎁" },
        {
            name: "Servicios",
            amount: 159317,
            percentage: 23.1,
            color: "bg-purple-400",
            textColor: "text-purple-500",
            icon: "🏢",
        },
        {
            name: "Salud",
            amount: 95037,
            percentage: 13.8,
            color: "bg-green-400",
            textColor: "text-green-500",
            icon: "🏥",
        },
        { name: "Deporte", amount: 74000, percentage: 10.8, color: "bg-cyan-400", textColor: "text-cyan-500", icon: "⚽" },
    ]

    const totalCategories = categories.reduce((sum, cat) => sum + cat.amount, 0)

    const transactions = [
        {
            id: 1,
            description: t("transaction.supermarket"),
            amount: -67.43,
            category: t("category.food"),
            time: t("time.hours.ago"),
            emoji: "🛒",
        },
        {
            id: 2,
            description: t("transaction.salary"),
            amount: 2600,
            category: t("category.income"),
            time: t("time.day.ago"),
            emoji: "💰",
        },
        {
            id: 3,
            description: t("transaction.netflix"),
            amount: -15.99,
            category: t("category.entertainment"),
            time: t("time.days.ago.2"),
            emoji: "🎬",
        },
        {
            id: 4,
            description: t("transaction.gas"),
            amount: -45.2,
            category: t("category.transport"),
            time: t("time.days.ago.3"),
            emoji: "⛽",
        },
    ]

    const budgetItems = [
        { category: "Comida", spent: 1247, budget: 1500, percentage: 83, color: "bg-blue-400" },
        { category: "Transporte", spent: 320, budget: 500, percentage: 64, color: "bg-purple-400" },
        { category: "Entretenimiento", spent: 180, budget: 300, percentage: 60, color: "bg-green-400" },
    ]

    const savingsGoals = [
        { name: "Fondo de Emergencia", current: 2800, goal: 5000, percentage: 56, color: "bg-blue-500", icon: "🏦" },
        { name: "Vacaciones 2024", current: 1200, goal: 3000, percentage: 40, color: "bg-purple-500", icon: "✈️" },
        { name: "Nuevo Auto", current: 8500, goal: 20000, percentage: 42.5, color: "bg-green-500", icon: "🚗" },
    ]

    return (
        <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-2xl border mx-2 sm:mx-0">
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
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-2 sm:p-4">
                            <CardTitle className="text-xs sm:text-sm font-medium text-blue-700">
                                {t("dashboard.total.balance")}
                            </CardTitle>
                            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent className="p-2 sm:p-4 pt-0">
                            <div className="text-sm sm:text-2xl font-bold text-blue-600">{formatAmount(animatedValues.balance)}</div>
                            <p className="text-xs text-blue-600 flex items-center mt-1">
                                <TrendingUp className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                                <span className="hidden sm:inline">+12% desde el mes pasado</span>
                                <span className="sm:hidden">+12%</span>
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-2 sm:p-4">
                            <CardTitle className="text-xs sm:text-sm font-medium text-green-700">
                                {t("dashboard.monthly.income")}
                            </CardTitle>
                            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                        </CardHeader>
                        <CardContent className="p-2 sm:p-4 pt-0">
                            <div className="text-sm sm:text-2xl font-bold text-green-600">{formatAmount(animatedValues.income)}</div>
                            <p className="text-xs text-green-600 mt-1">
                                <span className="hidden sm:inline">En camino para este mes</span>
                                <span className="sm:hidden">Este mes</span>
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-2 sm:p-4">
                            <CardTitle className="text-xs sm:text-sm font-medium text-purple-700">
                                {t("dashboard.monthly.expenses")}
                            </CardTitle>
                            <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent className="p-2 sm:p-4 pt-0">
                            <div className="text-sm sm:text-2xl font-bold text-purple-600">
                                {formatAmount(animatedValues.expenses)}
                            </div>
                            <p className="text-xs text-purple-600 flex items-center mt-1">
                                <TrendingDown className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                                <span className="hidden sm:inline">-5% desde el mes pasado</span>
                                <span className="sm:hidden">-5%</span>
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-2 sm:p-4">
                            <CardTitle className="text-xs sm:text-sm font-medium text-cyan-700">{t("dashboard.savings")}</CardTitle>
                            <PiggyBank className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-600" />
                        </CardHeader>
                        <CardContent className="p-2 sm:p-4 pt-0">
                            <div className="text-sm sm:text-2xl font-bold text-cyan-600">{formatAmount(animatedValues.savings)}</div>
                            <p className="text-xs text-cyan-600 mt-1">
                                <span className="hidden sm:inline">Meta fondo emergencia: 70%</span>
                                <span className="sm:hidden">Meta: 70%</span>
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                    {/* Monthly Income Chart */}
                    <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                        <CardHeader className="p-3 sm:p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-base sm:text-lg text-green-600">Ingresos Mensuales</CardTitle>
                                    <div className="text-xl sm:text-2xl font-bold text-green-600 mt-1">{formatAmount(14572144)}</div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-3 sm:p-4 pt-0">
                            <div className="space-y-1">
                                <div className="flex items-end justify-between gap-1" style={{ height: "128px" }}>
                                    {monthlyData.map((data, index) => (
                                        <div key={index} className="flex-1 flex flex-col items-center justify-end group h-full">
                                            <div
                                                className="w-full bg-gradient-to-t from-green-400 to-green-300 rounded-t transition-all duration-500 hover:from-green-500 hover:to-green-400"
                                                style={{
                                                    height: data.income > 0 ? `${(data.income / maxIncome) * 100}%` : "0px",
                                                    minHeight: data.income > 0 ? "8px" : "0px",
                                                }}
                                            ></div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between gap-1">
                                    {monthlyData.map((data, index) => (
                                        <div key={index} className="flex-1 text-center">
                                            <span className="text-xs text-slate-500">{data.month}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Monthly Expenses Chart */}
                    <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                        <CardHeader className="p-3 sm:p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-base sm:text-lg text-red-600">Gastos Mensuales</CardTitle>
                                    <div className="text-xl sm:text-2xl font-bold text-red-600 mt-1">{formatAmount(6416999)}</div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-3 sm:p-4 pt-0">
                            <div className="space-y-1">
                                <div className="flex items-end justify-between gap-1" style={{ height: "128px" }}>
                                    {monthlyData.map((data, index) => (
                                        <div key={index} className="flex-1 flex flex-col items-center justify-end group h-full">
                                            <div
                                                className="w-full bg-gradient-to-t from-red-400 to-red-300 rounded-t transition-all duration-500 hover:from-red-500 hover:to-red-400"
                                                style={{
                                                    height: data.expense > 0 ? `${(data.expense / maxExpense) * 100}%` : "0px",
                                                    minHeight: data.expense > 0 ? "8px" : "0px",
                                                }}
                                            ></div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between gap-1">
                                    {monthlyData.map((data, index) => (
                                        <div key={index} className="flex-1 text-center">
                                            <span className="text-xs text-slate-500">{data.month}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Category Analysis & Budget */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                    {/* Expenses by Category - Donut Chart */}
                    <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                        <CardHeader className="p-3 sm:p-4">
                            <CardTitle className="flex items-center text-sm sm:text-base text-slate-800">
                                Gastos por Categoría
                            </CardTitle>
                            <CardDescription className="text-xs sm:text-sm">Total: {formatAmount(totalCategories)}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-3 sm:p-4 pt-0">
                            <div className="flex items-center justify-center mb-4">
                                {/* Donut Chart SVG */}
                                <svg viewBox="0 0 200 200" className="w-40 h-40 sm:w-48 sm:h-48">
                                    {/* Background circle */}
                                    <circle cx="100" cy="100" r="80" fill="none" stroke="#f1f5f9" strokeWidth="40" />

                                    {/* Donut segments */}
                                    {(() => {
                                        let currentAngle = 0
                                        return categories.map((category, index) => {
                                            const segmentAngle = (category.percentage / 100) * 360
                                            const startAngle = currentAngle
                                            currentAngle += segmentAngle

                                            const startRadians = ((startAngle - 90) * Math.PI) / 180
                                            const endRadians = ((startAngle + segmentAngle - 90) * Math.PI) / 180

                                            const x1 = 100 + 80 * Math.cos(startRadians)
                                            const y1 = 100 + 80 * Math.sin(startRadians)
                                            const x2 = 100 + 80 * Math.cos(endRadians)
                                            const y2 = 100 + 80 * Math.sin(endRadians)

                                            const largeArc = segmentAngle > 180 ? 1 : 0

                                            const colors = ["#60a5fa", "#c084fc", "#4ade80", "#22d3ee"]

                                            return (
                                                <path
                                                    key={index}
                                                    d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                                    fill={colors[index]}
                                                    className="hover:opacity-80 transition-opacity cursor-pointer"
                                                />
                                            )
                                        })
                                    })()}

                                    {/* Center circle */}
                                    <circle cx="100" cy="100" r="50" fill="white" />
                                </svg>
                            </div>

                            {/* Category List */}
                            <div className="space-y-2">
                                {categories.map((category, index) => (
                                    <div key={index} className="flex items-center justify-between text-xs sm:text-sm">
                                        <div className="flex items-center space-x-2">
                                            <span>{category.icon}</span>
                                            <span className="text-slate-700">{category.name}</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-slate-600">{formatAmount(category.amount)}</span>
                                            <span className="text-slate-500 w-12 text-right font-medium">{category.percentage}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Budget Summary */}
                    <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                        <CardHeader className="p-3 sm:p-4">
                            <CardTitle className="text-sm sm:text-base text-slate-800">Resumen de Presupuesto</CardTitle>
                            <CardDescription className="text-xs sm:text-sm">Noviembre 2024</CardDescription>
                        </CardHeader>
                        <CardContent className="p-3 sm:p-4 pt-0 space-y-4">
                            {budgetItems.map((item, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs sm:text-sm font-medium text-slate-700">{item.category}</p>
                                            <p className="text-xs text-slate-500">
                                                {formatAmount(item.spent)} de {formatAmount(item.budget)}
                                            </p>
                                        </div>
                                        <span className="text-base sm:text-lg font-bold text-blue-600">{item.percentage}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${item.color} transition-all duration-1000`}
                                            style={{
                                                width: isVisible ? `${item.percentage}%` : "0%",
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Savings Goals & Recent Transactions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Savings Goals */}
                    {/* <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                        <CardHeader className="p-3 sm:p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-sm sm:text-base text-slate-800">Metas de Ahorro</CardTitle>
                                    <CardDescription className="text-xs sm:text-sm">Progreso actual</CardDescription>
                                </div>
                                <Target className="w-5 h-5 text-blue-500" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-3 sm:p-4 pt-0 space-y-4">
                            {savingsGoals.map((goal, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-lg">{goal.icon}</span>
                                            <div>
                                                <p className="text-xs sm:text-sm font-medium text-slate-700">{goal.name}</p>
                                                <p className="text-xs text-slate-500">
                                                    {formatAmount(goal.current)} / {formatAmount(goal.goal)}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-base sm:text-lg font-bold text-blue-600">{goal.percentage}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${goal.color} transition-all duration-1000`}
                                            style={{
                                                width: isVisible ? `${goal.percentage}%` : "0%",
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card> */}

                    {/* Recent Transactions */}
                    {/* <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                        <CardHeader className="p-3 sm:p-4">
                            <CardTitle className="text-sm sm:text-base text-slate-800">
                                {t("dashboard.recent.transactions")}
                            </CardTitle>
                            <CardDescription className="text-xs sm:text-sm">{t("dashboard.bot.activity")}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-3 sm:p-4 pt-0">
                            <div className="space-y-2 sm:space-y-3">
                                {transactions.map((transaction, index) => (
                                    <div
                                        key={transaction.id}
                                        className={`flex items-center justify-between p-2 rounded-lg hover:bg-blue-50 transition-all duration-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                                            }`}
                                        style={{
                                            transitionDelay: `${index * 100 + 800}ms`,
                                        }}
                                    >
                                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                                            <span className="text-lg">{transaction.emoji}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-xs sm:text-sm truncate text-slate-800">
                                                    {transaction.description}
                                                </p>
                                                <p className="text-xs text-slate-500">{transaction.time}</p>
                                            </div>
                                        </div>
                                        <div className="text-right ml-2">
                                            <p
                                                className={`font-semibold text-xs sm:text-sm ${transaction.amount > 0 ? "text-green-600" : "text-purple-600"}`}
                                            >
                                                {transaction.amount > 0 ? "+" : ""}
                                                {formatAmount(Math.abs(transaction.amount))}
                                            </p>
                                            <p className="text-xs text-slate-500">{transaction.category}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card> */}
                </div>

                {/* Floating WhatsApp Indicator */}
                <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-blue-500 text-white p-2 sm:p-3 rounded-full shadow-lg animate-bounce">
                    <div className="w-4 h-4 sm:w-6 sm:h-6 bg-white rounded-full flex items-center justify-center">
                        <span className="text-blue-500 text-xs font-bold">💬</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
