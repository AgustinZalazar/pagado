import { getTranslations } from 'next-intl/server';
import { DataTable } from '@/components/dashboard/DataTable'
import { columns } from '@/components/dashboard/DataTableComponents/columns'
import { SummaryCards } from '@/components/dashboard/incomes/summaryCards'
import { IncomesData } from '@/data/incomes'
import React from 'react'
import { Payment } from '@/types/payment';

async function getData(): Promise<Payment[]> {
    return IncomesData
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