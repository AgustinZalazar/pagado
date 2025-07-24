import React from 'react';
import { PiggyBank, CreditCard, TrendingUp, TrendingDown } from 'lucide-react';

interface SummaryCardProps {
    type: 'savings' | 'debt';
    amount: number;
    change: number;
    changePercent: number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ type, amount, change, changePercent }) => {
    const isSavings = type === 'savings';
    const isPositiveChange = change >= 0;

    const cardConfig = {
        savings: {
            title: 'Ahorros Totales',
            icon: PiggyBank,
            bgGradient: 'from-green-500 to-emerald-600',
            textColor: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        debt: {
            title: 'Deudas Totales',
            icon: CreditCard,
            bgGradient: 'from-red-500 to-rose-600',
            textColor: 'text-red-600',
            bgColor: 'bg-red-50',
        }
    };

    const config = cardConfig[type];
    const Icon = config.icon;

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full bg-gradient-to-r ${config.bgGradient}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center space-x-1 ${isPositiveChange ? 'text-green-500' : 'text-red-500'}`}>
                    {isPositiveChange ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    <span className="text-sm font-medium">
                        {isPositiveChange ? '+' : ''}{changePercent.toFixed(1)}%
                    </span>
                </div>
            </div>

            <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-700">{config.title}</h3>
                <div className="flex items-baseline space-x-2">
                    <span className={`text-3xl font-bold ${config.textColor}`}>
                        ${Math.abs(amount).toLocaleString('es-AR')}
                    </span>
                    <span className="text-sm text-gray-500">ARS</span>
                </div>

                <div className="flex items-center space-x-2 text-sm">
                    <span className="text-gray-600">Este mes:</span>
                    <span className={`font-medium ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositiveChange ? '+' : ''}${change.toLocaleString('es-AR')}
                    </span>
                </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
                <div className={`w-full ${config.bgColor} rounded-full h-2`}>
                    <div
                        className={`bg-gradient-to-r ${config.bgGradient} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${Math.min(Math.abs(changePercent) * 10, 100)}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default SummaryCard;