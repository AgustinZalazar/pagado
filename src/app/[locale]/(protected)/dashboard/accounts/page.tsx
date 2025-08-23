import { AccountsList } from '@/components/dashboard/accounts/account_list'
import { DialogWindowAccount } from '@/components/dashboard/accounts/DialogWindowAccount'
import React, { Suspense } from 'react'

const Accounts = () => {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <h1 className="text-3xl font-bold mb-4">Cuentas y metodos de pago</h1>
            <DialogWindowAccount />
            <Suspense fallback={
                <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
                </div>
            }>
                <AccountsList />
            </Suspense>
        </div>
    )
}

export default Accounts