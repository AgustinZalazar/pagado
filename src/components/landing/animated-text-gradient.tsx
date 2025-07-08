"use client"

import type React from "react"

import { useEffect, useState } from "react"

interface AnimatedTextGradientProps {
    children: React.ReactNode
    className?: string
}

export function AnimatedTextGradient({ children, className = "" }: AnimatedTextGradientProps) {
    const [gradientPosition, setGradientPosition] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setGradientPosition((prev) => (prev + 1) % 200)
        }, 50)

        return () => clearInterval(interval)
    }, [])

    return (
        <span
            className={`bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent ${className}`}
            style={{
                backgroundSize: "200% 100%",
                backgroundPosition: `${gradientPosition}% 0%`,
                animation: "gradient-shift 3s ease-in-out infinite",
            }}
        >
            {children}
            <style jsx>{`
        @keyframes gradient-shift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
        </span>
    )
}
