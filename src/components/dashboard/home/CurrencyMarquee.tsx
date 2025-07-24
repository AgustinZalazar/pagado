"use client"
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface CurrencyData {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
}

const CurrencyMarquee: React.FC = () => {
    const [currencies, setCurrencies] = useState<CurrencyData[]>([
        { symbol: 'USD/ARS', name: 'Dólar Blue', price: 1250.50, change: 15.50, changePercent: 1.26 },
        { symbol: 'BTC', name: 'Bitcoin', price: 67850.25, change: -1250.75, changePercent: -1.81 },
        { symbol: 'ETH', name: 'Ethereum', price: 3420.80, change: 85.30, changePercent: 2.56 },
        { symbol: 'EUR/ARS', name: 'Euro', price: 1365.20, change: 22.10, changePercent: 1.65 },
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrencies(prev => prev.map(currency => ({
                ...currency,
                price: currency.price + (Math.random() - 0.5) * 20,
                change: (Math.random() - 0.5) * 50,
                changePercent: (Math.random() - 0.5) * 5,
            })));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-white py-4 overflow-hidden relative">
            <div className="relative">
                <div className="animate-marquee whitespace-nowrap flex items-center space-x-12">
                    {currencies.concat(currencies).map((currency, index) => (
                        <div key={`${currency.symbol}-${index}`} className="flex items-center space-x-3 px-6">
                            <div className="flex flex-col">
                                <div className="flex items-center space-x-2">
                                    <span className="font-bold text-lg">{currency.symbol}</span>
                                    <span className="text-sm opacity-80">{currency.name}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="font-mono text-xl">
                                        ${currency.price.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                    <div className={`flex items-center space-x-1 ${currency.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {currency.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                        <span className="text-sm font-medium">
                                            {currency.changePercent >= 0 ? '+' : ''}{currency.changePercent.toFixed(2)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CurrencyMarquee;