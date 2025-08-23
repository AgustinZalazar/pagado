import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import React from 'react'

type ShineButtonProps = {
    text: string
}

const ShineButton: React.FC<ShineButtonProps> = ({ text }) => {
    return <Button
        className={cn(
            "relative animate-shine flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium transition-colors max-w-[200px]",
            // Bordes adaptados
            "border-neutral-200 dark:border-neutral-700",
            // Gradiente invertido
            "bg-[linear-gradient(110deg,#0a0a0a,45%,#2a2a2a,55%,#0a0a0a)] dark:bg-[linear-gradient(110deg,#f9f9f9,45%,#e5e5e5,55%,#f9f9f9)]",
            "bg-[length:400%_100%]",
            // Texto invertido
            "text-neutral-200 dark:text-neutral-800"
        )}
    >
        {text}
    </Button>
}

export default ShineButton