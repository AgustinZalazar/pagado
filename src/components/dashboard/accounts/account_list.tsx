"use client"

import { useState } from "react"
import { Building, Wallet, ChevronsUpDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import CardMethod from "./CardMethod"
import { DialogMethod } from "./DialogWindowMethod"
import { useGetAccounts } from "@/hooks/useAccount"
import { Account, Method } from "@/types/Accounts"
import { useGetMethods } from "@/hooks/useMethod"
import { Skeleton } from "@/components/ui/skeleton"

const AccountCardSkeleton = () => {
    return (
        <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100 w-[395px] flex-shrink-0">
            <div className="bg-gradient-to-r from-gray-200 to-gray-300 p-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div>
                            <Skeleton className="h-6 w-32 mb-2" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-5 w-8 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-4" />
                </div>
            </div>
        </div>
    );
};

export function AccountsList() {
    const [expandedAccounts, setExpandedAccounts] = useState<number[]>([])
    const { accounts, isLoading } = useGetAccounts();
    const { methods, isLoading: isLoadingMethods } = useGetMethods();

    // console.log(methods)
    const toggleAccountExpansion = (accountId: number) => {
        setExpandedAccounts((prev) =>
            prev.includes(accountId) ? prev.filter((id) => id !== accountId) : [...prev, accountId],
        )
    }

    if (isLoading || isLoadingMethods) {
        return (
            <div className="flex flex-wrap gap-4">
                {[1, 2, 3, 4].map((index) => (
                    <AccountCardSkeleton key={index} />
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-wrap gap-4">
            {accounts.lenght > 0 ?
                accounts.map((account: Account) => (
                    <div
                        key={account.id}
                        className="rounded-xl overflow-hidden shadow-lg border border-gray-100 w-[395px] flex-shrink-0"
                        style={{ height: expandedAccounts.includes(+account.id) ? "fit-content" : "fit-content" }}
                    >
                        <div className={`bg-gradient-to-r ${account.color} p-6 text-white`}>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
                                        <Building className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">{account.title}</h3>
                                        <p className="text-white/80 text-sm">
                                            • {account.type}
                                        </p>
                                    </div>
                                </div>
                                {/* <div className="text-right">
                            <p className="text-white/80 text-xs uppercase tracking-wider">Available Balance</p>
                            <p className="text-2xl font-bold flex items-center justify-end">
                                <DollarSign className="h-5 w-5" />
                                {account.balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                            </div> */}
                            </div>
                        </div>

                        <div className="bg-white">
                            <button
                                onClick={() => toggleAccountExpansion(+account.id)}
                                className="flex items-center justify-between w-full p-4 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-2 font-medium text-gray-700">
                                    <Wallet className="h-5 w-5" />
                                    <span>Metodos de pago</span>
                                    <Badge variant="outline" className="ml-2 bg-gray-100">
                                        {methods.filter((method: Method) => method.idAccount === account.id).length}
                                    </Badge>
                                </div>
                                <ChevronsUpDown className="h-4 w-4 text-gray-500" />
                            </button>

                            {expandedAccounts.includes(+account.id) && (
                                <div className="px-4 pb-4">
                                    <Separator className="my-2" />

                                    <div className="space-y-3 mt-3">
                                        {methods.filter((method: Method) => method.idAccount === account.id).map((method: Method) => (
                                            <CardMethod key={method.id} method={method} />
                                        ))}

                                        <DialogMethod idAccount={account.id} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))
                :
                <h2 className="text-xl font-bold m-4 text-center"> Por favor ingrese una cuenta y un metodo de pago</h2>
            }
        </div>
    )
}
