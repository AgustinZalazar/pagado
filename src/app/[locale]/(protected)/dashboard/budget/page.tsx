import { BudgetContent } from '@/components/dashboard/budget/BudgetContent';
import { useTranslations } from 'next-intl';
import { unstable_noStore as noStore } from 'next/cache';

// Server Component
const Budget = () => {
    noStore(); // Prevent caching for dynamic data
    const t = useTranslations('Dashboard.Budget');

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <h1 className="text-3xl font-bold mb-4">{t('title')}</h1>
            <BudgetContent />
        </div>
    )
}

export default Budget
