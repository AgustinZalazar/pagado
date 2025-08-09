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
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640); // sm breakpoint
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // useEffect(() => {
    //   const interval = setInterval(() => {
    //     setCurrencies(prev => prev.map(currency => ({
    //       ...currency,
    //       price: currency.price + (Math.random() - 0.5) * 20,
    //       change: (Math.random() - 0.5) * 50,
    //       changePercent: (Math.random() - 0.5) * 5,
    //     })));
    //   }, 5000);
    //   return () => clearInterval(interval);
    // }, []);

    useEffect(() => {
        setCurrencies(result)
    }, [isLoading])

    // En móvil, mostrar solo las primeras 4 monedas más importantes
    const displayCurrencies = isMobile ? currencies.slice(0, 4) : currencies;

    return (
        <div className="bg-white py-1 sm:py-2 md:py-4 overflow-hidden relative">
            {/* Contenedor con ancho limitado en móvil */}
            <div className="w-full max-w-[100vw] overflow-hidden">
                <div className={`flex space-x-3 sm:space-x-6 md:space-x-8 lg:space-x-12 ${isMobile ? 'animate-[marquee_4s_linear_infinite]' : 'animate-marquee'
                    }`}
                    style={{
                        width: isMobile
                            ? `${displayCurrencies.length * 80}px` // Ancho calculado para móvil
                            : 'max-content' // Ancho automático para desktop
                    }}>
                    {[...displayCurrencies, ...displayCurrencies].map((currency, index) => (
                        <div
                            key={`${currency.symbol}-${index}`}
                            className="flex items-center px-2 sm:px-4 md:px-6 min-w-0 flex-shrink-0"
                            style={{
                                minWidth: isMobile ? '110px' : 'auto' // Ancho mínimo fijo en móvil
                            }}
                        >
                            {/* Layout móvil: vertical y compacto */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
                                <div className="flex items-center space-x-1 sm:space-x-2">
                                    <span className="font-bold text-xs sm:text-base md:text-lg whitespace-nowrap">
                                        {currency.symbol}
                                    </span>
                                    <span className="text-[10px] sm:text-sm opacity-70 sm:opacity-80 hidden sm:inline">
                                        {currency.name}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <span className="font-mono text-xs sm:text-lg md:text-xl whitespace-nowrap">
                                        ${currency.price.toLocaleString("es-AR", {
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: currency.price > 1000 ? 0 : 2,
                                        })}
                                    </span>
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