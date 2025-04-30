import { AccountsList } from '@/components/dashboard/accounts/account_list'
import { DialogWindowAccount } from '@/components/dashboard/accounts/DialogWindowAccount'
import React from 'react'

const Accounts = () => {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <h1 className="text-3xl font-bold mb-4">Cuentas y metodos de pago</h1>
            <DialogWindowAccount />
            <AccountsList />
        </div>
    )
}

export default Accounts