"use client"

import { useState, useEffect } from "react"
import { FileSpreadsheet, Cloud, Lock, Download, RefreshCw, BarChart3, PieChart, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AnimatedSection } from "./animated-section"
import { useLanguage } from "./language-context"

export function DataStorageSection() {
    const { t } = useLanguage()
    const [isVisible, setIsVisible] = useState(false)
    const [syncStatus, setSyncStatus] = useState("syncing")

    useEffect(() => {
        setIsVisible(true)

        // Simulate sync status changes
        const timer = setTimeout(() => {
            setSyncStatus("synced")
        }, 2000)

        return () => clearTimeout(timer)
    }, [])

    return (
        <section className="w-full py-8 sm:py-12 md:py-24 lg:py-32 bg-gradient-to-br from-green-50/50 to-blue-50/50">
            <div className="container px-4 md:px-6">
                <AnimatedSection>
                    <div className="text-center mb-8 sm:mb-12">
                        <Badge variant="secondary" className="mb-4">
                            <BarChart3 className="w-3 h-3 mr-1" />
                            {t("storage.badge")}
                        </Badge>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">
                            {t("storage.title")}
                        </h2>
                        <p className="mx-auto max-w-[700px] text-muted-foreground text-sm sm:text-base md:text-lg lg:text-xl mt-4 px-4">
                            {t("storage.subtitle")}
                        </p>
                    </div>
                </AnimatedSection>

                <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center max-w-6xl mx-auto">
                    {/* Web Dashboard Preview */}
                    <AnimatedSection delay={200}>
                        <div className="relative group">
                            {/* Google Sheets Interface */}
                            <div className="bg-white rounded-xl shadow-2xl border overflow-hidden hover:shadow-3xl transition-all duration-300 group-hover:scale-105">
                                {/* Google Sheets Header */}
                                <div className="bg-green-600 px-4 py-3 flex items-center justify-between text-white">
                                    <div className="flex items-center space-x-3">
                                        <FileSpreadsheet className="w-5 h-5" />
                                        <div>
                                            <p className="font-semibold text-sm">Pagado - Mis Finanzas</p>
                                            <p className="text-xs opacity-80">Google Sheets</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div
                                            className={`flex items-center space-x-1 ${syncStatus === "synced" ? "text-green-200" : "text-yellow-200"}`}
                                        >
                                            <RefreshCw className={`w-3 h-3 ${syncStatus === "syncing" ? "animate-spin" : ""}`} />
                                            <span className="text-xs">
                                                {syncStatus === "synced" ? t("storage.synced") : t("storage.syncing")}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Spreadsheet Content */}
                                <div className="p-4">
                                    <div className="grid grid-cols-4 gap-1 text-xs">
                                        {/* Header Row */}
                                        <div className="bg-gray-100 p-2 font-semibold border">{t("storage.date")}</div>
                                        <div className="bg-gray-100 p-2 font-semibold border">{t("storage.description")}</div>
                                        <div className="bg-gray-100 p-2 font-semibold border">{t("storage.amount")}</div>
                                        <div className="bg-gray-100 p-2 font-semibold border">{t("storage.category")}</div>

                                        {/* Data Rows */}
                                        <div className="p-2 border text-gray-600">2024-01-15</div>
                                        <div className="p-2 border text-gray-800">{t("transaction.supermarket")}</div>
                                        <div className="p-2 border text-red-600">-$67.43</div>
                                        <div className="p-2 border text-blue-600">{t("category.food")}</div>

                                        <div className="p-2 border text-gray-600">2024-01-14</div>
                                        <div className="p-2 border text-gray-800">{t("transaction.salary")}</div>
                                        <div className="p-2 border text-green-600">+$2,600.00</div>
                                        <div className="p-2 border text-blue-600">{t("category.income")}</div>

                                        <div className="p-2 border text-gray-600">2024-01-13</div>
                                        <div className="p-2 border text-gray-800">{t("transaction.netflix")}</div>
                                        <div className="p-2 border text-red-600">-$15.99</div>
                                        <div className="p-2 border text-blue-600">{t("category.entertainment")}</div>

                                        <div className="p-2 border text-gray-600">2024-01-12</div>
                                        <div className="p-2 border text-gray-800">{t("transaction.gas")}</div>
                                        <div className="p-2 border text-red-600">-$45.20</div>
                                        <div className="p-2 border text-blue-600">{t("category.transport")}</div>
                                    </div>

                                    {/* Web Dashboard Analysis Panel */}
                                    <div className="mt-4 bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border-l-4 border-blue-500">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <BarChart3 className="w-4 h-4 text-blue-600" />
                                            <span className="text-sm font-medium text-blue-700">{t("storage.web.analysis")}</span>
                                        </div>
                                        <p className="text-xs text-blue-600 mb-2">{t("storage.analysis.description")}</p>

                                        {/* Mini charts in analysis */}
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="flex items-center space-x-2">
                                                <PieChart className="w-3 h-3 text-purple-500" />
                                                <span className="text-xs text-gray-600">{t("storage.chart.expenses")}: $3,247</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <TrendingUp className="w-3 h-3 text-green-500" />
                                                <span className="text-xs text-gray-600">{t("storage.chart.income")}: +12%</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Real-time Update Indicator */}
                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                            <span>{t("storage.live.updates")}</span>
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {t("storage.last.update")}: {t("time.hours.ago")}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Indicators */}
                            <div className="absolute -top-2 -right-2 bg-green-500 text-white p-2 rounded-full shadow-lg animate-bounce hidden sm:block">
                                <FileSpreadsheet className="w-4 h-4" />
                            </div>
                        </div>
                    </AnimatedSection>

                    {/* Features List */}
                    <AnimatedSection delay={400}>
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-xl sm:text-2xl font-bold">{t("storage.features.title")}</h3>
                                <p className="text-muted-foreground text-sm sm:text-base">{t("storage.features.subtitle")}</p>
                            </div>

                            <div className="space-y-4">
                                {[
                                    {
                                        icon: FileSpreadsheet,
                                        title: t("storage.feature.sheets.title"),
                                        description: t("storage.feature.sheets.desc"),
                                        color: "text-green-600",
                                    },
                                    {
                                        icon: BarChart3,
                                        title: t("storage.feature.dashboard.title"),
                                        description: t("storage.feature.dashboard.desc"),
                                        color: "text-blue-600",
                                    },
                                    {
                                        icon: PieChart,
                                        title: t("storage.feature.charts.title"),
                                        description: t("storage.feature.charts.desc"),
                                        color: "text-purple-600",
                                    },
                                    // {
                                    //     icon: TrendingUp,
                                    //     title: t("storage.feature.analytics.title"),
                                    //     description: t("storage.feature.analytics.desc"),
                                    //     color: "text-green-600",
                                    // },
                                    {
                                        icon: Cloud,
                                        title: t("storage.feature.cloud.title"),
                                        description: t("storage.feature.cloud.desc"),
                                        color: "text-cyan-600",
                                    },
                                    {
                                        icon: Lock,
                                        title: t("storage.feature.privacy.title"),
                                        description: t("storage.feature.privacy.desc"),
                                        color: "text-red-600",
                                    },
                                ].map((feature, index) => (
                                    <AnimatedSection key={feature.title} delay={index * 100 + 600}>
                                        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group border-blue-100 hover:border-blue-200">
                                            <CardContent className="p-4 sm:p-6">
                                                <div className="flex items-start space-x-4">
                                                    <div
                                                        className={`p-2 rounded-lg bg-gray-50 group-hover:bg-gray-100 transition-colors duration-200`}
                                                    >
                                                        <feature.icon
                                                            className={`w-5 h-5 ${feature.color} group-hover:scale-110 transition-transform duration-200`}
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-sm sm:text-base mb-1 group-hover:text-blue-600 transition-colors duration-200">
                                                            {feature.title}
                                                        </h4>
                                                        <p className="text-muted-foreground text-xs sm:text-sm">{feature.description}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </AnimatedSection>
                                ))}
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </div>
        </section>
    )
}
