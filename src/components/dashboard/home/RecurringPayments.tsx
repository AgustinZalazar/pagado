"use client"
import React, { useState } from 'react';
import { Calendar, Wifi, Tv, Zap, Car, Home, CreditCard, Clock, AlertCircle } from 'lucide-react';

interface Payment {
    id: string;
    name: string;
    amount: number;
    dueDate: string;
    category: 'utilities' | 'streaming' | 'insurance' | 'subscription' | 'loan';
    icon: React.ComponentType<any>;
    status: 'upcoming' | 'due' | 'overdue';
    autopay: boolean;
}

const RecurringPayments: React.FC = () => {
    const [payments] = useState<Payment[]>([
        {
            id: '1',
            name: 'Edesur',
            amount: 15000,
            dueDate: '2025-01-15',
            category: 'utilities',
            icon: Zap,
            status: 'upcoming',
            autopay: true
        },
        {
            id: '2',
            name: 'Netflix',
            amount: 8500,
            dueDate: '2025-01-12',
            category: 'streaming',
            icon: Tv,
            status: 'due',
            autopay: true
        },
        {
            id: '3',
            name: 'Internet Fibertel',
            amount: 12000,
            dueDate: '2025-01-18',
            category: 'utilities',
            icon: Wifi,
            status: 'upcoming',
            autopay: false
        },
        {
            id: '4',
            name: 'Seguro Auto',
            amount: 25000,
            dueDate: '2025-01-10',
            category: 'insurance',
            icon: Car,
            status: 'overdue',
            autopay: false
        },
        {
            id: '5',
            name: 'Spotify Premium',
            amount: 4200,
            dueDate: '2025-01-20',
            category: 'streaming',
            icon: Tv,
            status: 'upcoming',
            autopay: true
        },
        {
            id: '6',
            name: 'Expensas',
            amount: 35000,
            dueDate: '2025-01-25',
            category: 'utilities',
            icon: Home,
            status: 'upcoming',
            autopay: false
        },
        {
            id: '7',
            name: 'Tarjeta Visa',
            amount: 18500,
            dueDate: '2025-01-14',
            category: 'loan',
            icon: CreditCard,
            status: 'due',
            autopay: false
        }
    ]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'overdue':
                return 'text-red-600 bg-red-50 border-red-200';
            case 'due':
                return 'text-orange-600 bg-orange-50 border-orange-200';
            default:
                return 'text-blue-600 bg-blue-50 border-blue-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'overdue':
                return <AlertCircle size={14} className="text-red-500" />;
            case 'due':
                return <Clock size={14} className="text-orange-500" />;
            default:
                return <Calendar size={14} className="text-blue-500" />;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const diffTime = date.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return `Vencido hace ${Math.abs(diffDays)} días`;
        } else if (diffDays === 0) {
            return 'Vence hoy';
        } else if (diffDays === 1) {
            return 'Vence mañana';
        } else {
            return `En ${diffDays} días`;
        }
    };

    const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const overdueCount = payments.filter(p => p.status === 'overdue').length;
    const dueCount = payments.filter(p => p.status === 'due').length;

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-800">Pagos Recurrentes</h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Total mensual: ${totalAmount.toLocaleString('es-AR')}
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    {overdueCount > 0 && (
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                            {overdueCount} vencidos
                        </span>
                    )}
                    {dueCount > 0 && (
                        <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                            {dueCount} por vencer
                        </span>
                    )}
                </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
                {payments
                    .sort((a, b) => {
                        // Sort by status priority: overdue > due > upcoming
                        const statusPriority = { overdue: 0, due: 1, upcoming: 2 };
                        if (statusPriority[a.status] !== statusPriority[b.status]) {
                            return statusPriority[a.status] - statusPriority[b.status];
                        }
                        // Then sort by date
                        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                    })
                    .map((payment) => {
                        const Icon = payment.icon;
                        return (
                            <div
                                key={payment.id}
                                className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${getStatusColor(payment.status)}`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-3 flex-1">
                                        <div className="p-2 bg-white rounded-lg shadow-sm">
                                            <Icon size={16} className="text-gray-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2">
                                                <h4 className="font-semibold text-gray-800 truncate">
                                                    {payment.name}
                                                </h4>
                                                {payment.autopay && (
                                                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                                                        Auto
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center space-x-2 mt-1">
                                                {getStatusIcon(payment.status)}
                                                <span className="text-sm text-gray-600">
                                                    {formatDate(payment.dueDate)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-gray-800">
                                            ${payment.amount.toLocaleString('es-AR')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>

            {/* Summary */}
            <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">Próximos 7 días</div>
                        <div className="font-bold text-gray-800">
                            ${payments
                                .filter(p => {
                                    const dueDate = new Date(p.dueDate);
                                    const today = new Date();
                                    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                                    return diffDays >= 0 && diffDays <= 7;
                                })
                                .reduce((sum, p) => sum + p.amount, 0)
                                .toLocaleString('es-AR')}
                        </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">Con autopago</div>
                        <div className="font-bold text-gray-800">
                            {payments.filter(p => p.autopay).length}/{payments.length}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecurringPayments;