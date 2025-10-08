import { IncomesContent } from '@/components/dashboard/incomes/IncomesContent';
import { useTranslations } from 'next-intl';
import { unstable_noStore as noStore } from 'next/cache';

// Server Component
const Incomes = () => {
    noStore(); // Prevent caching for dynamic data
    const t = useTranslations('Dashboard.Incomes');

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <h1 className="text-3xl font-bold">{t('title')}</h1>
            <IncomesContent />
        </div>
    )
}

export default Incomes
