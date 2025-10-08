import { AccountsList } from '@/components/dashboard/accounts/account_list'
import { DialogWindowAccount } from '@/components/dashboard/accounts/DialogWindowAccount'
import { useTranslations } from 'next-intl';
import { unstable_noStore as noStore } from 'next/cache';

// Server Component - no "use client"
const Accounts = () => {
    noStore(); // Prevent caching for dynamic data
    const t = useTranslations('Dashboard.Accounts');

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <h1 className="text-3xl font-bold mb-4">{t('title')}</h1>
            <DialogWindowAccount />
            <AccountsList />
        </div>
    )
}

export default Accounts
