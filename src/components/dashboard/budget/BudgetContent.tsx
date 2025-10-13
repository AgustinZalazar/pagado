"use client"
import CardsContainer from '@/components/dashboard/budget/CardsContainer';
import { NewCategoryWindow } from '@/components/dashboard/budget/dialogWindows/newCategory';
import { BudgetSkeleton } from './BudgetSkeleton';
import { useGetCategories } from '@/hooks/useGetCategories';

export function BudgetContent() {
    const { categories, isLoading } = useGetCategories()

    if (isLoading) {
        return <BudgetSkeleton />;
    }

    return (
        <>
            <NewCategoryWindow />
            <CardsContainer categories={categories} type='category' isLoading={isLoading} />
        </>
    )
}
