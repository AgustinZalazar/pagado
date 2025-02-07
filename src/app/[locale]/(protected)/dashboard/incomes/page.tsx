"use client"
import React from 'react';
import { SummaryCards } from '@/components/dashboard/incomes/summaryCards'
import { DataTableContainer } from '@/components/dashboard/incomes/DataTableContainer';
import { useTranslations } from 'next-intl';
import { useTotalByCategory } from '@/hooks/useTotalByCategory';
import { useGetTransactions } from '@/hooks/useGetTransactions';
import { useTotalByMethod } from '@/hooks/useTotalByMethod';


const Incomes = () => {
    const { totalCategory, totalCat } = useTotalByCategory("2025-02-01")
    const { transactions, totalIncome, totalExpenses, isLoading } = useGetTransactions()
    const { totalMethod, totalMetCurrentMonth } = useTotalByMethod("2025-02-01")

    const t = useTranslations('Dashboard.Incomes');
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <h1 className="text-3xl font-bold">{t('title')}</h1>
            <SummaryCards totalIncome={totalIncome} totalExpenses={totalExpenses} totalCategory={totalCategory!} totalCat={totalCat} totalMethod={totalMethod!} totalMetCurrentMonth={totalMetCurrentMonth} />
            <DataTableContainer data={!isLoading ? transactions : []} />
        </div>
    )
}

export default Incomes