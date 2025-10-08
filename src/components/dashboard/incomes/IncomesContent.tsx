"use client"
import React from 'react';
import { SummaryCards } from '@/components/dashboard/incomes/summaryCards'
import { DataTableContainer } from '@/components/dashboard/incomes/DataTableContainer';
import { IncomesSkeleton } from './IncomesSkeleton';
import { useMonth } from '@/context/monthContext';
import { useTransactionsSummary } from '@/hooks/useTransactionsSummary';
import { useSession } from 'next-auth/react';
import { useGetUserInfo } from '@/hooks/useUser';

const getLastMonth = (date: string) => {
    const [year, month] = date.split("-").map(Number);
    const previousDate = new Date(Date.UTC(year, month - 2, 1)).toISOString();
    return previousDate.split("T")[0];
}

export function IncomesContent() {
    const { selectedMonth } = useMonth();
    const lastMonth = getLastMonth(selectedMonth);
    const { data: session } = useSession()
    const { user, isLoading: isLoadingUser } = useGetUserInfo(session?.user.email as string)
    const {
        transactions,
        totalIncome,
        totalExpenses,
        totalLastIncome,
        totalLastExpenses,
        categorySummary: { totalCategory, totalCat },
        methodSummary: { totalMethod, totalMetCurrentMonth },
        isLoading,
        otherCurrencies
    } = useTransactionsSummary(selectedMonth, lastMonth, user.currency);


    if (isLoading || isLoadingUser) {
        return <IncomesSkeleton />;
    }

    return (
        <>
            <SummaryCards
                totalIncome={totalIncome}
                totalExpenses={totalExpenses}
                totalCategory={totalCategory!}
                totalCat={totalCat}
                totalMethod={totalMethod!}
                totalMetCurrentMonth={totalMetCurrentMonth}
                totalLastIncome={totalLastIncome}
                totalLastExpense={totalLastExpenses}
                otherCurrencies={otherCurrencies}
            />
            <DataTableContainer data={transactions} isLoading={isLoading} />
        </>
    )
}
