import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { CreditCard, Edit2, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { DialogMethod } from './DialogWindowMethod'
import { Method } from '@/types/Accounts'
import { useDeleteMethod } from '@/hooks/useMethod'


// Helper function to get card type icon background
const getCardTypeBg = (cardType: string) => {
    switch (cardType) {
        case "Visa":
            return "bg-blue-100 text-blue-600"
        case "Mastercard":
            return "bg-orange-100 text-orange-600"
        case "American Express":
            return "bg-green-100 text-green-600"
        case "Discover":
            return "bg-purple-100 text-purple-600"
        default:
            return "bg-gray-100 text-gray-600"
    }
}

interface Props {
    method: Method,
}

const CardMethod = ({ method }: Props) => {
    const { deleteMethod } = useDeleteMethod()

    return <Card
        key={method.id}
        className="overflow-hidden border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900"
    >
        <CardContent className="p-0">
            <div className="flex items-center gap-4 p-3">
                {/* Ícono tarjeta */}
                <div
                    className={`rounded-full p-2 ${getCardTypeBg(method.cardType)}`}
                >
                    <CreditCard className="h-5 w-5" />
                </div>

                {/* Info */}
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-600 dark:text-gray-200">
                            {method.title}
                        </span>
                    </div>
                    <p className="text-sm text-gray-400 dark:text-gray-400">
                        {method.cardType}
                    </p>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-1">
                    <DialogMethod
                        isEdit
                        method={method}
                        idAccount={method.idAccount as string}
                    />
                    <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400"
                        onClick={() => deleteMethod(method.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </CardContent>
    </Card>

}

export default CardMethod