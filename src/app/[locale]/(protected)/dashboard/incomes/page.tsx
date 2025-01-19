import { getTranslations } from 'next-intl/server';
import { DataTable } from '@/components/dashboard/DataTable'
// import { columns } from '@/components/dashboard/DataTableComponents/columns'
import { SummaryCards } from '@/components/dashboard/incomes/summaryCards'
// import { IncomesData } from '@/data/incomes'
import React from 'react'
import { Payment } from '@/types/payment';
import { DataTableContainer } from '@/components/dashboard/DataTableContainer';
// import { auth } from '@/auth';
import { getTotalIncomes } from '@/actions/getTotalIncomes';
import { getTotalExpenses } from '@/actions/getTotalExpenses';

async function getData(): Promise<Payment[]> {
    // const session = await auth();
    // const accessToken = session?.accessToken;
    // console.log(accessToken)
    const response = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/get-transactions`, { next: { tags: ['transactions'] } }).then((resp) => resp.json())
    const { formattedTransactions } = await response
    return formattedTransactions
}

const Incomes = async () => {
    const data = await getData()
    const totalIncome = await getTotalIncomes(data)
    const totalExpenses = await getTotalExpenses(data)
    const t = await getTranslations('Dashboard.Incomes');
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>
            <SummaryCards totalIncome={totalIncome} totalExpenses={totalExpenses} totalCategory={0} totalMethod={0} />
            <DataTableContainer data={data} />
            {/* <DataTable columns={columns} data={data} /> */}
        </div>
    )
}

export default Incomes