"use client"
import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { BookX } from 'lucide-react';
import { useTotalByCategory } from '@/hooks/useTotalByCategory';
import { getIconComponent } from '@/data/icons';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

const ExpensePieChart: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const date = new Date().toISOString();
    const currentDate = date.split("T")[0];
    const { totalByCategory, isLoading } = useTotalByCategory(currentDate)
    const total = totalByCategory.reduce((sum, item) => sum + item.value, 0);
    const router = useRouter();
    const t = useTranslations('Dashboard.Home.ExpensePieChart');

    const onPieEnter = (_: any, index: number) => setActiveIndex(index);
    const onPieLeave = () => setActiveIndex(null);

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            const percentage = ((data.value / total) * 100).toFixed(1);
            return (
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <p className="font-semibold text-gray-800 dark:text-gray-100">{data.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        ${data.value.toLocaleString('es-AR')} ({percentage}%)
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 relative">
            {!isLoading &&
                totalByCategory.length === 0 &&
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/20 dark:from-gray-800/60 dark:via-gray-800/40 dark:to-gray-800/20 backdrop-blur-sm z-10 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl px-6 py-4 shadow-xl border border-white/20 dark:border-gray-700">
                            <div className="flex items-center justify-center mb-2">
                                <div className="bg-gradient-to-r from-black to-gray-600 dark:from-gray-700 dark:to-gray-500 p-3 rounded-full">
                                    <BookX className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">{t('noDataTitle')}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400"> {t('noDataDescription')}</p>
                            <Button variant="link" className='mt-4 font-bold dark:text-blue-400' onClick={() => { router.push('/incomes') }}>
                                {t('button')}
                            </Button>
                        </div>
                    </div>
                </div>
            }

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{t('title')}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Total: ${total.toLocaleString('es-AR')}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pie Chart */}
                <div className="h-80">
                    {!isLoading && (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={totalByCategory}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    innerRadius={40}
                                    paddingAngle={2}
                                    dataKey="value"
                                    onMouseEnter={onPieEnter}
                                    onMouseLeave={onPieLeave}
                                >
                                    {totalByCategory.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                            stroke={activeIndex === index ? '#1f2937' : 'none'} // dark: bg-gray-800
                                            strokeWidth={activeIndex === index ? 3 : 0}
                                            style={{
                                                filter: activeIndex === index ? 'brightness(1.15)' : 'none',
                                                transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                                                transformOrigin: 'center',
                                                transition: 'all 0.2s ease-in-out'
                                            }}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    content={<CustomTooltip />}
                                    wrapperStyle={{ outline: 'none' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Legend with Icons */}
                <div className="space-y-3">
                    {!isLoading && (
                        <>
                            {totalByCategory.map((item, index) => {
                                const IconComponent = getIconComponent(item.icon as string);
                                const percentage = ((item.value / total) * 100).toFixed(1);
                                const isActive = activeIndex === index;

                                return (
                                    <div
                                        key={item.name}
                                        className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer 
                                    ${isActive
                                                ? 'bg-gray-100 dark:bg-gray-800 shadow-md'
                                                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                                            }`}
                                        onMouseEnter={() => setActiveIndex(index)}
                                        onMouseLeave={() => setActiveIndex(null)}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div
                                                className="p-2 rounded-full"
                                                style={{ backgroundColor: `${item.color}20` }}
                                            >
                                                <IconComponent
                                                    size={16}
                                                    style={{ color: item.color }}
                                                />
                                            </div>
                                            <span className="font-medium text-gray-700 dark:text-gray-200">{item.name}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold text-gray-800 dark:text-gray-100">
                                                ${item.value.toLocaleString('es-AR')}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {percentage}%
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExpensePieChart;
