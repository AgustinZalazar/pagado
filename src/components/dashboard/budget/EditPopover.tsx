import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Edit, MoreVertical, Trash } from 'lucide-react';
import { FormCategory } from './FormCategories'
import { Button } from '@/components/ui/button'
import { Category } from '@/types/category'
import { useDeleteCategory } from '@/hooks/useGetCategories';
import { useTranslations } from 'next-intl';
import { ReusableDialogWindow } from '../windows/ReusableDialogWindow';

interface Props {
    item: Category,
    totalPercentage: number
}

const EditPopover = ({ item, totalPercentage }: Props) => {
    const { deleteCategory } = useDeleteCategory()
    const t = useTranslations('Dashboard.Budget');

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className='bg-transparent rounded-sm hover:bg-slate-100 p-1'>
                    <MoreVertical className="h-4 w-4" />
                </button>
            </PopoverTrigger>
            <PopoverContent className='flex flex-col w-[120px] p-1'>
                <ReusableDialogWindow
                    title={t("titleEditDialog")}
                    description={t("descriptionEditDialog")}
                    trigger={
                        <Button variant="outline" className="px-2 py-1 rounded-sm flex gap-2 w-full">
                            <Edit className="w-4 text-gray-600" /> {t('editButton')}
                        </Button>
                    }
                >
                    {({ setOpenDialog }) => (
                        <FormCategory
                            category={item}
                            totalPercentage={totalPercentage}
                            setOpenPopover={setOpenDialog}
                        />
                    )}
                </ReusableDialogWindow>
                <Button variant="outline" className='mt-2' onClick={() => deleteCategory(item.id)}>
                    <Trash /> {t('deleteButton')}
                </Button>
            </PopoverContent>
        </Popover>
    )
}

export default EditPopover