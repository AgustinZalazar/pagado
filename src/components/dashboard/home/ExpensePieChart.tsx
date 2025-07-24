"use client"
import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Car, Home, Zap, Gift, ShoppingCart, Coffee, MoreHorizontal } from 'lucide-react';
import { useTotalByCategory } from '@/hooks/useTotalByCategory';
import { getIconComponent } from '@/data/icons';

const expenseData = [
    { name: 'Auto', value: 45000, color: '#3b82f6', icon: Car },
    { name: 'Servicios', value: 32000, color: '#10b981', icon: Zap },
    { name: 'Hogar', value: 28000, color: '#f59e0b', icon: Home },
    { name: 'Regalos', value: 15000, color: '#ef4444', icon: Gift },
    { name: 'Compras', value: 22000, color: '#8b5cf6', icon: ShoppingCart },
    { name: 'Entretenimiento', value: 18000, color: '#06b6d4', icon: Coffee },
    { name: 'Otros', value: 12000, color: '#6b7280', icon: MoreHorizontal },
];

const ExpensePieChart: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const date = new Date().toISOString();
    const currentDate = date.split("T")[0];
    const { totalByCategory, isLoading } = useTotalByCategory(currentDate)
    const total = totalByCategory.reduce((sum, item) => sum + item.value, 0);

    const onPieEnter = (_: any, index: number) => {
        setActiveIndex(index);
    };

    const onPieLeave = () => {
        setActiveIndex(null);
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            const percentage = ((data.value / total) * 100).toFixed(1);
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border">
                    <p className="font-semibold text-gray-800">{data.name}</p>
                    <p className="text-sm text-gray-600">
                        ${data.value.toLocaleString('es-AR')} ({percentage}%)
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-800">Gastos por Categoría</h3>
                    <p className="text-sm text-gray-600 mt-1">
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
                                            stroke={activeIndex === index ? '#fff' : 'none'}
                                            strokeWidth={activeIndex === index ? 3 : 0}
                                            style={{
                                                filter: activeIndex === index ? 'brightness(1.1)' : 'none',
                                                transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                                                transformOrigin: 'center',
                                                transition: 'all 0.2s ease-in-out'
                                            }}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    )
                    }
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
                                        className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer ${isActive ? 'bg-gray-50 shadow-md' : 'hover:bg-gray-50'
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
                                            <span className="font-medium text-gray-700">{item.name}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold text-gray-800">
                                                ${item.value.toLocaleString('es-AR')}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {percentage}%
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    )
                    }
                </div>
            </div>
        </div>
    );
};

export default ExpensePieChart;