"use client"
import React, { useEffect } from 'react';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, ChevronDown } from 'lucide-react';
import { useGetExpensesByMonth } from '@/hooks/useGetTransactions';

// Weekly data - daily income for current week
const weeklyIncomeData = [
    { name: 'Lun', income: 12500 },
    { name: 'Mar', income: 8900 },
    { name: 'Mié', income: 15200 },
    { name: 'Jue', income: 11800 },
    { name: 'Vie', income: 18500 },
    { name: 'Sáb', income: 6200 },
    { name: 'Dom', income: 4800 },
];

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

// Monthly data - monthly income for current year
const monthlyIncomeData = [
    { name: 'Ene', income: 285000 },
    { name: 'Feb', income: 312000 },
    { name: 'Mar', income: 298000 },
    { name: 'Abr', income: 325000 },
    { name: 'May', income: 341000 },
    { name: 'Jun', income: 356000 },
    { name: 'Jul', income: 378000 },
    { name: 'Ago', income: 365000 },
    { name: 'Sep', income: 389000 },
    { name: 'Oct', income: 412000 },
    { name: 'Nov', income: 398000 },
    { name: 'Dic', income: 425000 },
];
type IncomeItem = {
    name: string;
    income: number;
};

const IncomeChart: React.FC = () => {
    const [period, setPeriod] = useState<'weekly' | 'monthly'>('monthly');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [currentData, setCurrentData] = useState<IncomeItem[]>([])
    const { summary, isLoading } = useGetExpensesByMonth()

    useEffect(() => {
        const dataMonth = monthOrder.map((month) => ({
            name: monthMap[month],
            income: Math.round(summary?.monthly?.incomes[month] || 0),
        }));

        const dataDay = dayOrder.map((day) => ({
            name: dayMap[day],
            income: Math.round(summary?.weekly?.expenses[day] || 0),
        }));
        setCurrentData(period === 'weekly' ? dataDay : dataMonth)
    }, [isLoading, period])

    // const currentData = period === 'weekly' ? weeklyIncomeData : monthlyIncomeData;
    const totalIncome = currentData.reduce((sum, item) => sum + item.income, 0);
    // const avgIncome = totalIncome / currentData.length;

    // Calculate trend based on last vs previous period
    // const lastValue = currentData[currentData.length - 1].income;
    // const previousValue = currentData[currentData.length - 2].income;
    // const trend = lastValue > previousValue;
    // const trendPercent = ((lastValue - previousValue) / previousValue * 100).toFixed(1);

    const periodLabel = period === 'weekly' ? 'Semanal' : 'Mensual';
    // const timeUnit = period === 'weekly' ? 'esta semana' : 'este año';

    return (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">Ingresos {periodLabel}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xl sm:text-2xl font-bold text-green-600">
                            ${totalIncome.toLocaleString('es-AR')}
                        </span>
                        {/* <span className="text-sm text-gray-500">{timeUnit}</span>
                        <div className={`flex items-center space-x-1 ${trend ? 'text-green-500' : 'text-red-500'}`}>
                            {trend ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            <span className="text-sm font-medium">
                                {trend ? '+' : ''}{trendPercent}%
                            </span>
                        </div> */}
                    </div>
                </div>
                {/* <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                    >
                        <span className="text-sm font-medium text-gray-700">{periodLabel}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                            <button
                                onClick={() => {
                                    setPeriod('weekly');
                                    setIsDropdownOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-t-lg ${period === 'weekly' ? 'text-green-600 font-medium' : 'text-gray-700'}`}
                            >
                                Semanal
                            </button>
                            <button
                                onClick={() => {
                                    setPeriod('monthly');
                                    setIsDropdownOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-b-lg ${period === 'monthly' ? 'text-green-600 font-medium' : 'text-gray-700'}`}
                            >
                                Mensual
                            </button>
                        </div>
                    )}
                </div> */}
            </div>
            <div className="h-48 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={currentData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" stroke="#666" fontSize={10} tick={{ fontSize: 10 }} />
                        <YAxis stroke="#666" fontSize={10} tick={{ fontSize: 10 }} />
                        <Tooltip
                            formatter={(value) => [`$${value.toLocaleString('es-AR')}`, 'Ingresos']}
                            labelStyle={{ color: '#333' }}
                            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px' }}
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
            </div>
        </div>
    );
};
type ExpenseItem = {
    name: string;
    expense: number;
};



const dayOrder = [
    "lun", "mar", "mier", "jue", "vie", "sab",
    "dom"
];

const dayMap: Record<string, string> = {
    "lun": "Lun",
    "mar": "Mar",
    "mier": "Mié",
    "jue": "Jue",
    "vie": "Vie",
    "sab": "Sab",
    "dom": "Dom",
};



const ExpenseChart: React.FC = () => {
    const [period, setPeriod] = useState<'weekly' | 'monthly'>('monthly');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [currentData, setCurrentData] = useState<ExpenseItem[]>([])
    const { summary, isLoading } = useGetExpensesByMonth()

    // console.log({ expenses: summary })
    useEffect(() => {
        const dataMonth = monthOrder.map((month) => ({
            name: monthMap[month],
            expense: Math.round(summary?.monthly?.expenses[month] || 0),
        }));

        const dataDay = dayOrder.map((day) => ({
            name: dayMap[day],
            expense: Math.round(summary?.weekly?.expenses[day] || 0),
        }));
        setCurrentData(period === 'weekly' ? dataDay : dataMonth)
    }, [isLoading, period])

    const totalExpense = currentData.reduce((sum, item) => sum + item.expense, 0);
    const avgExpense = currentData.length > 0 ? totalExpense / currentData.length : 0;

    let trend = false;
    let trendPercent = '0';

    if (currentData.length >= 2) {
        const lastValue = currentData[currentData.length - 1].expense;
        const previousValue = currentData[currentData.length - 2].expense;
        trend = lastValue < previousValue;
        trendPercent = ((lastValue - previousValue) / previousValue * 100).toFixed(1);
    }


    const periodLabel = period === 'weekly' ? 'Semanal' : 'Mensual';
    const timeUnit = period === 'weekly' ? 'esta semana' : 'este año';

    return (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300">
            {!isLoading &&
                <>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-800">Gasto {periodLabel}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                                <span className="text-xl sm:text-2xl font-bold text-red-600">
                                    ${totalExpense.toLocaleString('es-AR')}
                                </span>
                                {/* <span className="text-sm text-gray-500">{timeUnit}</span>
                                <div className={`flex items-center space-x-1 ${trend ? 'text-green-500' : 'text-red-500'}`}>
                                    {trend ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                                    <span className="text-sm font-medium">
                                        {trend ? '' : '+'}{trendPercent}%
                                    </span>
                                </div> */}
                            </div>
                        </div>
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                            >
                                <span className="text-sm font-medium text-gray-700">{periodLabel}</span>
                                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                    <button
                                        onClick={() => {
                                            setPeriod('weekly');
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-t-lg ${period === 'weekly' ? 'text-red-600 font-medium' : 'text-gray-700'}`}
                                    >
                                        Semanal
                                    </button>
                                    <button
                                        onClick={() => {
                                            setPeriod('monthly');
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-b-lg ${period === 'monthly' ? 'text-red-600 font-medium' : 'text-gray-700'}`}
                                    >
                                        Mensual
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="h-48 sm:h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={currentData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" stroke="#666" fontSize={10} tick={{ fontSize: 10 }} />
                                <YAxis stroke="#666" fontSize={10} tick={{ fontSize: 10 }} />
                                <Tooltip
                                    formatter={(value) => [`$${value.toLocaleString('es-AR')}`, 'Gastos']}
                                    labelStyle={{ color: '#333' }}
                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px' }}
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
                    </div>
                </>

            }
        </div>
    );
};

export { IncomeChart, ExpenseChart };