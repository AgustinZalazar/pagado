"use client"
import React from 'react';
import { SummaryCards } from '@/components/dashboard/incomes/summaryCards'
import { DataTableContainer } from '@/components/dashboard/incomes/DataTableContainer';
import { useTranslations } from 'next-intl';
import { useTotalByCategory } from '@/hooks/useTotalByCategory';
import { useGetTransactions } from '@/hooks/useGetTransactions';
import { useTotalByMethod } from '@/hooks/useTotalByMethod';
import { useMonth } from '@/context/monthContext';


const getLastMonth = (date: string) => {
    const [year, month] = date.split("-").map(Number);
    const previousDate = new Date(Date.UTC(year, month - 2, 1)).toISOString();

    return previousDate.split("T")[0];
}


const Incomes = () => {
    const { selectedMonth } = useMonth();
    const lastMonth = getLastMonth(selectedMonth);
    const { totalCategory, totalCat } = useTotalByCategory(selectedMonth)
    const { transactions, totalIncome, totalExpenses, isLoading } = useGetTransactions(selectedMonth)
    const { totalIncome: totalLastIncome, totalExpenses: totalLastExpenses } = useGetTransactions(lastMonth)
    const { totalMethod, totalMetCurrentMonth } = useTotalByMethod(selectedMonth)

    const t = useTranslations('Dashboard.Incomes');
    // console.log(transactions)
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <h1 className="text-3xl font-bold">{t('title')}</h1>
            <SummaryCards
                totalIncome={totalIncome}
                totalExpenses={totalExpenses}
                totalCategory={totalCategory!}
                totalCat={totalCat}
                totalMethod={totalMethod!}
                totalMetCurrentMonth={totalMetCurrentMonth}
                totalLastIncome={totalLastIncome}
                totalLastExpense={totalLastExpenses}
            />
            <DataTableContainer data={transactions} />
        </div>
    )
}

export default Incomes