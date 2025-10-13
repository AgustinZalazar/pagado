"use client"
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BookX, ChevronDown } from 'lucide-react';
import { useGetExpensesByMonth } from '@/hooks/useGetTransactions';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChartSkeleton } from '../BarChartSkeleton';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

const monthMap: Record<string, string> = {
    "Enero": "Ene",
    "Febrero": "Feb",
    "Marzo": "Mar",
    "Abril": "Abr",
    "Mayo": "May",
    "Junio": "Jun",
    "Julio": "Jul",
    "Agosto": "Ago",
    "Septiembre": "Sep",
    "Octubre": "Oct",
    "Noviembre": "Nov",
    "Diciembre": "Dic",
};
const monthOrder = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

type IncomeItem = { name: string; income: number };
type ExpenseItem = { name: string; expense: number };

const dayOrder = ["lun", "mar", "mier", "jue", "vie", "sab", "dom"];
const dayMap: Record<string, string> = {
    "lun": "Lun", "mar": "Mar", "mier": "Mié", "jue": "Jue",
    "vie": "Vie", "sab": "Sab", "dom": "Dom",
};

// ======================= INCOME =======================
const IncomeChart: React.FC = () => {
    const [period, setPeriod] = useState<'weekly' | 'monthly'>('monthly');
    const [currentData, setCurrentData] = useState<IncomeItem[]>([]);
    const { summary, isLoading } = useGetExpensesByMonth();
    const router = useRouter();
    const t = useTranslations('Dashboard.Home.IncomeChart');

    useEffect(() => {
        const dataMonth = monthOrder.map((month) => ({
            name: monthMap[month],
            income: Math.round(summary?.monthly?.incomes[month] || 0),
        }));
        const dataDay = dayOrder.map((day) => ({
            name: dayMap[day],
            income: Math.round(summary?.weekly?.expenses[day] || 0),
        }));
        setCurrentData(period === 'weekly' ? dataDay : dataMonth);
    }, [isLoading, period]);

    const totalIncome = currentData.reduce((sum, item) => sum + item.income, 0);
    const periodLabel = period === 'weekly' ? 'Semanal' : 'Mensual';

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300 relative">
            {!isLoading &&
                Object.values(summary?.monthly?.incomes).every(v => v === 0) && (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/20 dark:from-gray-800/60 dark:via-gray-800/40 dark:to-gray-800/20 backdrop-blur-sm z-10 rounded-xl flex items-center justify-center">
                        <div className="text-center">
                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl px-6 py-4 shadow-xl border border-white/20 dark:border-gray-700">
                                <div className="flex items-center justify-center mb-2">
                                    <div className="bg-gradient-to-r from-black to-gray-600 dark:from-gray-700 dark:to-gray-500 p-3 rounded-full">
                                        <BookX className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">{t('emptyDataTitle')}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{t('emptyDataDescription')}</p>
                                <Button variant="link" className="mt-4 font-bold dark:text-green-400" onClick={() => router.push('/dashboard/incomes')}>
                                    {t('button')}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">{t('title')}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                        {isLoading ? (
                            <Skeleton className="h-7 sm:h-8 w-32 rounded-md" />
                        ) : (
                            <span className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                                ${totalIncome.toLocaleString("es-AR")}
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <div className="h-48 sm:h-64">
                {isLoading ? (
                    <BarChartSkeleton />
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={currentData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" className="dark:stroke-gray-700" />
                            <XAxis dataKey="name" stroke="#666" tick={{ fontSize: 10, fill: "#666" }} />
                            <YAxis stroke="#666" tick={{ fontSize: 10, fill: "#666" }} />
                            <Tooltip
                                formatter={(value) => [`$${value.toLocaleString("es-AR")}`, "Ingresos"]}
                                contentStyle={{
                                    backgroundColor: "#fff",
                                    border: "1px solid #e0e0e0",
                                    borderRadius: "8px",
                                    color: "#333",
                                }}
                                wrapperStyle={{ outline: "none" }}
                            />
                            <Bar dataKey="income" fill="url(#incomeGradient)" radius={[4, 4, 0, 0]} />
                            <defs>
                                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10b981" />
                                    <stop offset="100%" stopColor="#059669" />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

// ======================= EXPENSE =======================
const ExpenseChart: React.FC = () => {
    const [period, setPeriod] = useState<'weekly' | 'monthly'>('monthly');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [currentData, setCurrentData] = useState<ExpenseItem[]>([]);
    const { summary, isLoading } = useGetExpensesByMonth();
    const router = useRouter();
    const t = useTranslations('Dashboard.Home.ExpenseChart');
    const lang = useLocale()

    useEffect(() => {
        const dataMonth = monthOrder.map((month) => ({
            name: monthMap[month],
            expense: Math.round(summary?.monthly?.expenses[month] || 0),
        }));
        const dataDay = dayOrder.map((day) => ({
            name: dayMap[day],
            expense: Math.round(summary?.weekly?.expenses[day] || 0),
        }));
        setCurrentData(period === 'weekly' ? dataDay : dataMonth);
    }, [isLoading, period]);

    const totalExpense = currentData.reduce((sum, item) => sum + item.expense, 0);
    const periodLabel = period === 'weekly' ? t('weekly') : t('monthly');

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300 relative">
            {!isLoading &&
                Object.values(summary?.monthly?.expenses).every(v => v === 0) && (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/20 dark:from-gray-800/60 dark:via-gray-800/40 dark:to-gray-800/20 backdrop-blur-sm z-10 rounded-xl flex items-center justify-center">
                        <div className="text-center">
                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl px-6 py-4 shadow-xl border border-white/20 dark:border-gray-700">
                                <div className="flex items-center justify-center mb-2">
                                    <div className="bg-gradient-to-r from-black to-gray-600 dark:from-gray-700 dark:to-gray-500 p-3 rounded-full">
                                        <BookX className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">{t('emptyDataTitle')}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{t('emptyDataDescription')}</p>
                                <Button variant="link" className="mt-4 font-bold dark:text-red-400" onClick={() => router.push('/dashboard/incomes')}>
                                    {t('button')}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">{lang === "es" ? `${t('title')} ${periodLabel}` : `${periodLabel} ${t('title')}`} </h3>
                    <div className="flex items-center space-x-2 mt-1">
                        {isLoading ? (
                            <Skeleton className="h-7 sm:h-8 w-32 rounded-md" />
                        ) : (
                            <span className="text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400">
                                ${totalExpense.toLocaleString('es-AR')}
                            </span>
                        )}
                    </div>
                </div>
                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                    >
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{periodLabel}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                            <button
                                onClick={() => {
                                    setPeriod('weekly');
                                    setIsDropdownOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg ${period === 'weekly' ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-700 dark:text-gray-200'}`}
                            >
                                {t('weekly')}
                            </button>
                            <button
                                onClick={() => {
                                    setPeriod('monthly');
                                    setIsDropdownOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded-b-lg ${period === 'monthly' ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-700 dark:text-gray-200'}`}
                            >
                                {t('monthly')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="h-48 sm:h-64">
                {isLoading ? (
                    <BarChartSkeleton />
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={currentData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" className="dark:stroke-gray-700" />
                            <XAxis dataKey="name" stroke="#666" tick={{ fontSize: 10, fill: "#666" }} />
                            <YAxis stroke="#666" tick={{ fontSize: 10, fill: "#666" }} />
                            <Tooltip
                                formatter={(value) => [`$${value.toLocaleString('es-AR')}`, 'Gastos']}
                                contentStyle={{
                                    backgroundColor: "#fff",
                                    border: "1px solid #e0e0e0",
                                    borderRadius: "8px",
                                    color: "#333",
                                }}
                                wrapperStyle={{ outline: "none" }}
                            />
                            <Bar dataKey="expense" fill="url(#expenseGradient)" radius={[4, 4, 0, 0]} />
                            <defs>
                                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#ef4444" />
                                    <stop offset="100%" stopColor="#dc2626" />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export { IncomeChart, ExpenseChart };
