"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

interface ShineButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text: string
}

export const ShineButton = React.forwardRef<HTMLButtonElement, ShineButtonProps>(
    ({ text, className, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "relative animate-shine flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium transition-colors max-w-[200px]",
                    "border-neutral-200 dark:border-neutral-700",
                    "bg-[linear-gradient(110deg,#0a0a0a,45%,#2a2a2a,55%,#0a0a0a)] dark:bg-[linear-gradient(110deg,#f9f9f9,45%,#e5e5e5,55%,#f9f9f9)]",
                    "bg-[length:400%_100%]",
                    "text-neutral-200 dark:text-neutral-800",
                    className
                )}
                {...props}
            >
                {text}
            </button>
        )
    }
)

ShineButton.displayName = "ShineButton"