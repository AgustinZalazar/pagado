import React from 'react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'
import { Button } from '../ui/button'
import { CircleDollarSign } from 'lucide-react'

interface props {
    children: React.ReactNode,
    isTransactions: boolean
}

const HoverCardsTemplate = ({ children, isTransactions }: props) => {
    return <HoverCard>
        <HoverCardTrigger asChild>
            {isTransactions ?
                <div className="relative w-8 h-5">
                    <CircleDollarSign className="w-5 h-5 text-gray-300 absolute" />
                    <CircleDollarSign className="w-5 h-5 text-gray-400 absolute right-[1px] z-10" />
                    <CircleDollarSign className="w-5 h-5 text-gray-500 absolute -right-[10px] z-20" />
                </div>
                :
                <Button variant="link">@nextjs</Button>
            }
        </HoverCardTrigger>
        <HoverCardContent align='end' className="w-40">
            {children}
        </HoverCardContent>
    </HoverCard>
}

export default HoverCardsTemplate