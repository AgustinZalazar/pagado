import { cn } from '@/lib/utils'
import { Sparkles } from 'lucide-react'
import React from 'react'

const ButtonShineBorder = () => {
    return (
        <button className="group relative w-full grid overflow-hidden rounded-xl px-4 py-2 shadow-[0_1000px_0_0_hsl(0_0%_85%)_inset] transition-colors duration-200 dark:shadow-[0_1000px_0_0_hsl(0_0%_20%)_inset]">
            <span>
                <span
                    className={cn(
                        "spark mask-gradient absolute inset-0 h-[100%] w-[100%] animate-flip overflow-hidden rounded-xl",
                        "[mask:linear-gradient(black,_transparent_50%)] before:absolute before:aspect-square before:w-[200%]",
                        "before:bg-[conic-gradient(from_0deg,transparent_0_340deg,#FFD700,#FFC107,#FFB300,#FFD700)]",
                        "before:shadow-[0_0_20px_10px_rgba(255,215,0,0.7)] before:rotate-[-90deg] before:animate-rotate",
                        "before:content-[''] before:[inset:0_auto_auto_50%] before:[translate:-50%_-15%]",
                        "dark:[mask:linear-gradient(white,_transparent_50%)]"
                    )}
                />
            </span>
            <span className="backdrop absolute inset-px rounded-[11px] bg-black transition-colors duration-200 " />
            <span className="z-10 text-sm font-medium text-white flex gap-2 justify-center items-center">
                Subscribite al plan pro <Sparkles className='text-yellow-400 w-4' />
            </span>
        </button>
    )
}

export default ButtonShineBorder