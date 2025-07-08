"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"

export interface Currency {
    code: string
    symbol: string
    name: string
    country: string
}

export const currencies: Currency[] = [
    { code: "USD", symbol: "$", name: "Dólar Estadounidense", country: "Estados Unidos" },
    { code: "EUR", symbol: "€", name: "Euro", country: "España" },
    { code: "MXN", symbol: "$", name: "Peso Mexicano", country: "México" },
    { code: "COP", symbol: "$", name: "Peso Colombiano", country: "Colombia" },
    { code: "ARS", symbol: "$", name: "Peso Argentino", country: "Argentina" },
    { code: "CLP", symbol: "$", name: "Peso Chileno", country: "Chile" },
    { code: "PEN", symbol: "S/", name: "Sol Peruano", country: "Perú" },
    { code: "UYU", symbol: "$U", name: "Peso Uruguayo", country: "Uruguay" },
    { code: "BOB", symbol: "Bs", name: "Boliviano", country: "Bolivia" },
    { code: "GTQ", symbol: "Q", name: "Quetzal", country: "Guatemala" },
]

interface CurrencyContextType {
    currency: Currency
    setCurrency: (currency: Currency) => void
    formatAmount: (amount: number) => string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrency] = useState<Currency>(currencies[0]) // Default to USD

    const formatAmount = (amount: number): string => {
        const formattedNumber = amount.toLocaleString("es-ES", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })

        // Handle different currency symbols
        switch (currency.code) {
            case "EUR":
                return `${formattedNumber}€`
            case "PEN":
                return `S/ ${formattedNumber}`
            case "UYU":
                return `$U ${formattedNumber}`
            case "BOB":
                return `Bs ${formattedNumber}`
            case "GTQ":
                return `Q ${formattedNumber}`
            default:
                return `${currency.symbol}${formattedNumber}`
        }
    }

    return <CurrencyContext.Provider value={{ currency, setCurrency, formatAmount }}>{children}</CurrencyContext.Provider>
}

export function useCurrency() {
    const context = useContext(CurrencyContext)
    if (context === undefined) {
        throw new Error("useCurrency must be used within a CurrencyProvider")
    }
    return context
}
