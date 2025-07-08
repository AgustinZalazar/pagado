"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { TrendingUp, DollarSign, PiggyBank, Target } from "lucide-react"
import { useCurrency } from "./currency-context"

export function FloatingCards() {
    const [isVisible, setIsVisible] = useState(false)
    const { formatAmount } = useCurrency()

    useEffect(() => {
        setIsVisible(true)
    }, [])

    const cards = [
        {
            icon: TrendingUp,
            title: "Portafolio",
            value: "+12.5%",
            color: "text-blue-500",
            delay: "0s",
            position: { left: "5%", top: "15%" },
        },
        {
            icon: DollarSign,
            title: "Saldo",
            value: formatAmount(12450),
            color: "text-blue-600",
            delay: "0.5s",
            position: { right: "5%", top: "20%" },
        },
        {
            icon: PiggyBank,
            title: "Ahorros",
            value: formatAmount(2800),
            color: "text-cyan-500",
            delay: "1s",
            position: { left: "8%", bottom: "25%" },
        },
        {
            icon: Target,
            title: "Meta",
            value: "85%",
            color: "text-indigo-500",
            delay: "1.5s",
            position: { right: "8%", bottom: "20%" },
        },
    ]

    return (
        <div className="absolute inset-0 pointer-events-none">
            {cards.map((card, index) => {
                const Icon = card.icon
                return (
                    <Card
                        key={index}
                        className={`absolute w-32 h-20 p-3 backdrop-blur-sm bg-white/10 border-white/20 shadow-xl transition-all duration-1000 hidden lg:block ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                            }`}
                        style={{
                            ...card.position,
                            animationDelay: card.delay,
                            animation: isVisible ? `floatCard 6s ease-in-out infinite ${card.delay}` : "none",
                        }}
                    >
                        <div className="flex items-center space-x-2">
                            <Icon className={`w-4 h-4 ${card.color}`} />
                            <div>
                                <p className="text-xs">{card.title}</p>
                                <p className={`text-sm font-bold ${card.color}`}>{card.value}</p>
                            </div>
                        </div>
                    </Card>
                )
            })}

            <style jsx>{`
        @keyframes floatCard {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(1deg);
          }
        }
      `}</style>
        </div>
    )
}
