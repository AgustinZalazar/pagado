"use client"
import React, { useEffect, useState } from 'react';
import { SummaryCards } from '@/components/dashboard/incomes/summaryCards'
import { Payment } from '@/types/payment';
import { DataTableContainer } from '@/components/dashboard/DataTableContainer';
import { getTotalIncomes } from '@/actions/getTotalIncomes';
import { getTotalExpenses } from '@/actions/getTotalExpenses';
import { useTranslations } from 'next-intl';

// async function getData(): Promise<Payment[]> {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/get-transactions`, { next: { tags: ['transactions'] } }).then((resp) => resp.json())
//     console.log(response)
//     const { formattedTransactions } = await response
//     if (formattedTransactions) {
//         return formattedTransactions
//     } else {
//         return []
//     }
// }

const Incomes = () => {
    const [transaction, setTransaction] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const getCategories = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/get-transactions`, { next: { tags: ['transactions'] } }).then((resp) => resp.json())
            const { formattedTransactions } = await response
            if (formattedTransactions) {
                setTransaction(formattedTransactions)
                setIsLoading(false)
            }

        } catch (error) {
            console.log(error)
        }

    }
    useEffect(() => {
        getCategories();
    }, [])
    // const totalIncome = await getTotalIncomes(transaction)
    const totalIncome = 0
    // const totalExpenses = await getTotalExpenses(data)
    const totalExpenses = 0
    const t = useTranslations('Dashboard.Incomes');
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <h1 className="text-3xl font-bold">{t('title')}</h1>
            <SummaryCards totalIncome={totalIncome} totalExpenses={totalExpenses} totalCategory={0} totalMethod={0} />
            <DataTableContainer data={!isLoading ? transaction : []} />
            {/* <DataTable columns={columns} data={data} /> */}
        </div>
    )
}

export default Incomes