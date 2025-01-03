import { getTranslations } from 'next-intl/server';
import { DataTable } from '@/components/dashboard/DataTable'
import { columns, Payment } from '@/components/dashboard/DataTableComponents/columns'
import { SummaryCards } from '@/components/dashboard/incomes/summaryCards'
import React from 'react'

async function getData(): Promise<Payment[]> {

    // Fetch data from your API here.
    return [
        {
            id: "a1f2d3e4",
            description: "Monthly subscription",
            type: "expense",
            category: "Entertainment",
            amount: 15.99,
            date: "2024-12-01",
            typeOfPayment: "Credit Card",
        },
        {
            id: "b2e3f4g5",
            description: "Freelance project payment",
            type: "income",
            category: "Work",
            amount: 250.00,
            date: "2024-12-10",
            typeOfPayment: "Bank Transfer",
        },
        {
            id: "c3f4g5h6",
            description: "Grocery shopping",
            type: "expense",
            category: "Food",
            amount: 123.45,
            date: "2024-12-15",
            typeOfPayment: "Debit Card",
        },
        {
            id: "d4g5h6i7",
            description: "Utility bill payment",
            type: "expense",
            category: "Utilities",
            amount: 85.50,
            date: "2024-11-30",
            typeOfPayment: "Online Payment",
        },
        {
            id: "e5h6i7j8",
            description: "Bonus from work",
            type: "income",
            category: "Salary",
            amount: 1200.00,
            date: "2024-12-20",
            typeOfPayment: "Direct Deposit",
        },
    ]
}

const Incomes = async () => {
    const data = await getData()
    const t = await getTranslations('Dashboard.Incomes');
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>
            <SummaryCards totalIncome={500} totalExpenses={350} />
            <DataTable columns={columns} data={data} />
        </div>
    )
}

export default Incomes