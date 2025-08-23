import React from 'react';
import { PiggyBank, CreditCard, TrendingUp, TrendingDown, Lock } from 'lucide-react';

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
            textColor: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-50 dark:bg-green-950/30',
        },
        debt: {
            title: 'Deudas Totales',
            icon: CreditCard,
            bgGradient: 'from-red-500 to-rose-600',
            textColor: 'text-red-600 dark:text-red-400',
            bgColor: 'bg-red-50 dark:bg-red-950/30',
        }
    };

    const config = cardConfig[type];
    const Icon = config.icon;

    return (
        <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 sm:p-6 
                        hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 
                        overflow-hidden group border border-gray-100 dark:border-gray-800">

            {/* Glass Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/20 
                            dark:from-gray-800/60 dark:via-gray-800/40 dark:to-gray-800/20
                            backdrop-blur-sm z-10 rounded-xl flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md 
                                    rounded-2xl px-6 py-4 shadow-xl border border-white/20 dark:border-gray-700/40">
                        <div className="flex items-center justify-center mb-2">
                            <div className="bg-gradient-to-r from-black to-gray-600 p-3 rounded-full">
                                <Lock className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-1">Próximamente</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Esta función estará disponible pronto
                        </p>
                    </div>
                </div>
            </div>

            {/* Ribbon */}
            <div className="absolute -top-1 -right-1 z-20">
                <div className="bg-gradient-to-r from-black to-gray-600 text-white px-3 py-1 
                                rounded-bl-lg rounded-tr-xl text-xs font-bold shadow-lg">
                    PRO
                </div>
            </div>

            {/* Original Content */}
            <div className="relative z-0">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${config.bgGradient}`}>
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className={`flex items-center space-x-1 ${isPositiveChange ? 'text-green-500' : 'text-red-500'}`}>
                        {isPositiveChange ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        <span className="text-sm font-medium">
                            {isPositiveChange ? '+' : ''}{changePercent.toFixed(1)}%
                        </span>
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200">
                        {config.title}
                    </h3>
                    <div className="flex items-baseline space-x-2">
                        <span className={`text-2xl sm:text-3xl font-bold ${config.textColor}`}>
                            ${Math.abs(amount).toLocaleString('es-AR')}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">ARS</span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Este mes:</span>
                        <span className={`font-medium ${isPositiveChange ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
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
        </div>
    );
};

export default SummaryCard;
