"use client"
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useGetExchangeRate } from '@/hooks/useExchangeRate';

interface CurrencyData {
    symbol: string;
    name: string;
    price: number;
    // change: number;
    // changePercent: number;
}

type FormattedRate = {
    symbol: string;
    name: string;
    price: number;
};

export function formatExchangeData(data: any): FormattedRate[] {
    if (!data) return [];

    const formatted = [];

    // Dólares (USD/ARS)
    const casasDeseadas = ["blue", "oficial", "bolsa", "tarjeta"];
    data.dolares.forEach((d: any) => {
        if (casasDeseadas.includes(d.casa)) {
            formatted.push({
                symbol: "USD/ARS",
                name: `Dólar ${d.nombre}`,
                price: d.venta,
            });
        }
    });

    // Euro (EUR/ARS)
    const euro = data.cotizaciones.find((c: any) => c.moneda === "EUR");
    if (euro) {
        formatted.push({
            symbol: "EUR/ARS",
            name: "Euro",
            price: euro.venta,
        });
    }

    // BTC/USD (elegimos el primer exchange)
    if (data.btc_usd?.length) {
        formatted.push({
            symbol: "BTC/USD",
            name: "Bitcoin",
            price: data.btc_usd[0].venta,
        });
    }

    // ETH/USD
    if (data.eth_usd?.length) {
        formatted.push({
            symbol: "ETH/USD",
            name: "Ethereum",
            price: data.eth_usd[0].venta,
        });
    }

    return formatted;
}

const CurrencyMarquee: React.FC = () => {
    const { exchange, isLoading, error } = useGetExchangeRate();
    const result = !isLoading ? formatExchangeData(exchange) : [];
    const [currencies, setCurrencies] = useState<CurrencyData[]>([]);

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setCurrencies(prev => prev.map(currency => ({
    //             ...currency,
    //             price: currency.price + (Math.random() - 0.5) * 20,
    //             change: (Math.random() - 0.5) * 50,
    //             changePercent: (Math.random() - 0.5) * 5,
    //         })));
    //     }, 5000);

    //     return () => clearInterval(interval);
    // }, []);

    useEffect(() => {
        setCurrencies(result)
    }, [isLoading])


    return (
        <div className="bg-white py-4 overflow-hidden relative">
            <div className="flex w-max animate-marquee space-x-12">
                {[...currencies, ...currencies].map((currency, index) => (
                    <div
                        key={`${currency.symbol}-${index}`}
                        className="flex items-center space-x-3 px-6"
                    >
                        <div className="flex flex-col">
                            <div className="flex items-center space-x-2">
                                <span className="font-bold text-lg">{currency.symbol}</span>
                                <span className="text-sm opacity-80">{currency.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="font-mono text-xl">
                                    $
                                    {currency.price.toLocaleString("es-AR", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CurrencyMarquee;