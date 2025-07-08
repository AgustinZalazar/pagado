"use client"

import { useState } from "react"
import { ChevronDown, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { currencies, useCurrency } from "./currency-context"

export function CurrencySelector() {
    const [isOpen, setIsOpen] = useState(false)
    const { currency, setCurrency } = useCurrency()

    return (
        <div className="relative">
            <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-1 sm:space-x-2 backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20 text-xs sm:text-sm px-2 sm:px-3"
            >
                <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{currency.code}</span>
                <span className="sm:hidden">{currency.symbol}</span>
                <ChevronDown className="w-2 h-2 sm:w-3 sm:h-3" />
            </Button>

            {isOpen && (
                <>
                    {/* Mobile backdrop */}
                    <div className="fixed inset-0 z-40 md:hidden" onClick={() => setIsOpen(false)} />

                    <Card
                        className={`absolute z-50 backdrop-blur-sm bg-white/95 border-white/20 ${
                            // Mobile: full width dropdown from top
                            "top-full mt-2 left-0 right-0 mx-4 md:mx-0 md:right-0 md:left-auto md:w-64"
                            }`}
                    >
                        <CardContent className="p-2">
                            <div className="space-y-1 max-h-60 overflow-y-auto">
                                {currencies.map((curr) => (
                                    <button
                                        key={curr.code}
                                        onClick={() => {
                                            setCurrency(curr)
                                            setIsOpen(false)
                                        }}
                                        className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-blue-50 transition-colors ${currency.code === curr.code ? "bg-blue-100 text-blue-700" : "text-gray-700"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="font-medium">
                                                    {curr.symbol} {curr.code}
                                                </span>
                                                <div className="text-xs text-gray-500 md:block hidden">{curr.country}</div>
                                            </div>
                                            <span className="text-xs text-gray-400 hidden sm:block">{curr.name}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    )
}