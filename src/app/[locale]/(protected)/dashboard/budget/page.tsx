"use client"
import CardsContainer from '@/components/dashboard/budget/CardsContainer';
import { NewCategoryWindow } from '@/components/dashboard/budget/dialogWindows/newCategory';
import { useGetCategories } from '@/hooks/useGetCategories';
import { useLocale, useTranslations } from 'next-intl';
import React from 'react'

const Budget = () => {
    const t = useTranslations('Dashboard.Budget');
    const { categories, isLoading } = useGetCategories()

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <h1 className="text-3xl font-bold mb-4">{t('title')}</h1>
            <NewCategoryWindow />
            <CardsContainer categories={categories} type='category' isLoading={isLoading} />
        </div>
    )
}

export default Budget