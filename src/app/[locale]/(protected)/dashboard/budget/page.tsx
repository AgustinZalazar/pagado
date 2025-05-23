"use client"
import CardsContainer from '@/components/dashboard/budget/CardsContainer';
import { NewCategoryWindow } from '@/components/dashboard/budget/dialogWindows/newCategory';
import { useGetCategories } from '@/hooks/useGetCategories';
import { useLocale, useTranslations } from 'next-intl';
import React from 'react'

const Budget = () => {
    // const locale = useLocale()
    const t = useTranslations('Dashboard.Budget');
    const { categories } = useGetCategories()
    // const columns = getColumnsCategories(locale, categories)
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <h1 className="text-3xl font-bold mb-4">{t('title')}</h1>
            {/* <DataTableContainer data={categories} columns={columns} /> */}
            {/* <div className='w-full max-w-[1440px] mx-auto'> */}
            <NewCategoryWindow />
            {/* </div> */}
            <CardsContainer categories={categories} type='category' />
        </div>
    )
}

export default Budget