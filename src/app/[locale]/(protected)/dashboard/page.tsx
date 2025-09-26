import CategoryBreakdown from "@/components/dashboard/home/CategoryPercent";
import CurrencyMarquee from "@/components/dashboard/home/CurrencyMarquee";
import ExpensePieChart from "@/components/dashboard/home/ExpensePieChart";
import { ExpenseChart, IncomeChart } from "@/components/dashboard/home/IncomeExpenseChart";
import RecurringPayments from "@/components/dashboard/home/RecurringPayments";
import SummaryCard from "@/components/dashboard/home/SummaryCard";
import { useTranslations } from "next-intl";
import { Suspense } from "react";

export default function Dashboard() {
    const t = useTranslations('Dashboard.Home');
    return (
        <div className="min-h-screen w-full px-4 md:px-6 xl:px-8">
            <div className="max-w-screen-2xl mx-auto w-full">
                <div className="flex flex-col gap-4 pt-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold mb-1">{t('title')}</h1>
                        <p className="text-muted-foreground text-sm">
                            {t('description')}
                        </p>
                    </div>
                </div>
                <Suspense fallback={
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
                    </div>
                }>
                    <div className="mt-4">
                        <CurrencyMarquee />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-6 gap-6 mt-6">
                        {/* Main Content - 4 columnas */}
                        <div className="lg:col-span-2 xl:col-span-4 space-y-6">
                            {/* Income and Expense Charts */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <IncomeChart />
                                <ExpenseChart />
                            </div>
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <SummaryCard
                                    type="savings"
                                    amount={285000}
                                    change={15000}
                                    changePercent={5.6}
                                />
                                <SummaryCard
                                    type="debt"
                                    amount={-125000}
                                    change={-8000}
                                    changePercent={-6.0}
                                />
                            </div>
                            {/* Expense Breakdown */}
                            <ExpensePieChart />
                        </div>

                        {/* Sidebar: Recurring Payments */}
                        <div className="lg:col-span-1 xl:col-span-2 gap-2 space-y-6">
                            <RecurringPayments />
                            <CategoryBreakdown />
                        </div>
                    </div>
                </Suspense>
            </div>
        </div>
    );
}
