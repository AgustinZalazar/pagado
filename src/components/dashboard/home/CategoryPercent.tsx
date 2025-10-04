"use client"
import React, { useMemo } from 'react';
import { PieChart, Home as HomeIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTotalByCategory } from '@/hooks/useTotalByCategory';
import { useMonth } from '@/context/monthContext';
import { getIconComponent } from '@/data/icons';

interface CategoryData {
    name: string;
    amount: number;
    color: string;
    icon: React.ComponentType<any>;
    percentage: number;
}

const CategoryBreakdown: React.FC = () => {
    const t = useTranslations('Dashboard.Home.CategoryPercent');
    const { selectedMonth } = useMonth();
    const { totalByCategory, isLoading } = useTotalByCategory(selectedMonth);

    // Calcular el total y preparar los datos
    const { categoryData, totalAmount } = useMemo(() => {
        const total = totalByCategory.reduce((sum, item) => sum + item.value, 0);

        const data: CategoryData[] = totalByCategory
            .map(item => ({
                name: item.name,
                amount: item.value,
                color: item.color,
                icon: item.icon ? getIconComponent(item.icon) : HomeIcon,
                percentage: total > 0 ? parseFloat(((item.value / total) * 100).toFixed(1)) : 0
            }))
            .sort((a, b) => b.amount - a.amount); // Ordenar de mayor a menor

        return { categoryData: data, totalAmount: total };
    }, [totalByCategory]);

    // Mostrar loading state
    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden h-fit">
                <div className="p-6 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
                </div>
            </div>
        );
    }

    // Si no hay datos
    if (categoryData.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden h-fit">
                <div className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                            <PieChart className="w-5 h-5 text-gray-800 dark:text-gray-100" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">
                            {t('title')}
                        </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm text-center py-8">
                        No hay gastos registrados para este mes
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden h-fit">
            {/* Header */}
            <div className="p-4 sm:p-6">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <PieChart className="w-5 h-5 text-gray-800 dark:text-gray-100" />
                    </div>
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">
                            {t('title')}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                            Total: ${totalAmount.toLocaleString('es-AR')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
                <div className="space-y-3 max-h-80 overflow-y-auto">
                    {categoryData.map((category) => {
                        const Icon = category.icon;

                        return (
                            <div
                                key={category.name}
                                className="group p-3 sm:p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 hover:shadow-md transition-all duration-200"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className="p-2 rounded-full"
                                            style={{ backgroundColor: `${category.color}20` }}
                                        >
                                            <Icon
                                                className="w-4 h-4"
                                                style={{ color: category.color }}
                                            />
                                        </div>
                                        <div>
                                            <h4 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-100">
                                                {category.name}
                                            </h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                ${category.amount.toLocaleString('es-AR')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div
                                            className="text-lg sm:text-xl font-bold"
                                            style={{ color: category.color }}
                                        >
                                            {category.percentage}%
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                                    <div
                                        className="h-2 rounded-full transition-all duration-500 ease-out"
                                        style={{
                                            backgroundColor: category.color,
                                            width: `${category.percentage}%`
                                        }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Summary */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="text-sm text-gray-600 dark:text-gray-400">{t('highest')}</div>
                            <div className="text-base font-bold text-gray-800 dark:text-gray-100">
                                {categoryData[0]?.name || '-'}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {categoryData[0]?.percentage || 0}%
                            </div>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="text-sm text-gray-600 dark:text-gray-400">{t('actives')}</div>
                            <div className="text-base font-bold text-gray-800 dark:text-gray-100">
                                {categoryData.length}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {t('actives2')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryBreakdown;
