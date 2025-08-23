import React from 'react';
import { Car, Home, Zap, Gift, ShoppingCart, Coffee, MoreHorizontal, PieChart } from 'lucide-react';

interface CategoryData {
    name: string;
    amount: number;
    color: string;
    icon: React.ComponentType<any>;
    percentage: number;
}

const CategoryBreakdown: React.FC = () => {
    const categoryData: CategoryData[] = [
        { name: 'Auto', amount: 45000, color: '#3b82f6', icon: Car, percentage: 26.2 },
        { name: 'Servicios', amount: 32000, color: '#10b981', icon: Zap, percentage: 18.6 },
        { name: 'Hogar', amount: 28000, color: '#f59e0b', icon: Home, percentage: 16.3 },
        { name: 'Compras', amount: 22000, color: '#8b5cf6', icon: ShoppingCart, percentage: 12.8 },
        { name: 'Entretenimiento', amount: 18000, color: '#06b6d4', icon: Coffee, percentage: 10.5 },
        { name: 'Regalos', amount: 15000, color: '#ef4444', icon: Gift, percentage: 8.7 },
        { name: 'Otros', amount: 12000, color: '#6b7280', icon: MoreHorizontal, percentage: 7.0 },
    ];

    const totalAmount = categoryData.reduce((sum, item) => sum + item.amount, 0);

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
                            Gastos por Categoría
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
                            <div className="text-sm text-gray-600 dark:text-gray-400">Mayor Gasto</div>
                            <div className="text-base font-bold text-gray-800 dark:text-gray-100">
                                {categoryData[0].name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {categoryData[0].percentage}%
                            </div>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="text-sm text-gray-600 dark:text-gray-400">Categorías</div>
                            <div className="text-base font-bold text-gray-800 dark:text-gray-100">
                                {categoryData.length}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                activas
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryBreakdown;
