import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Edit, MoreVertical, Trash } from 'lucide-react';
import { FormCategory } from './FormCategories'
import { Button } from '@/components/ui/button'
import { Category } from '@/types/category'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useDeleteCategory } from '@/hooks/useGetCategories';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface Props {
    item: Category,
    totalPercentage: number
}

const EditPopover = ({ item, totalPercentage }: Props) => {
    const [openEditCatDialog, setOpenEditCatDialog] = useState(false)
    const { deleteCategory } = useDeleteCategory()
    const t = useTranslations('Dashboard.Budget');

    return <Popover>
        <PopoverTrigger asChild>
            <button className='bg-transparent rounded-sm hover:bg-slate-100 p-1'>
                <MoreVertical className="h-4 w-4" />
            </button>
        </PopoverTrigger>
        <PopoverContent className='flex flex-col w-[120px] p-1'>
            <Dialog
                open={openEditCatDialog}
                onOpenChange={setOpenEditCatDialog}
            >
                <DialogTrigger>
                    <Button variant="outline" className="px-2 py-1 rounded-sm flex gap-2 w-full">
                        <Edit className="w-4 text-gray-600" /> {t('editButton')}
                    </Button>
                </DialogTrigger>
                <DialogContent className={cn(
                    // Layout base
                    "w-[95vw] max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl",
                    // Ajustes responsive
                    "mx-auto rounded-xl p-6",
                    // Manejo de contenido grande
                    "max-h-[90vh] overflow-y-auto"
                )}>
                    <DialogHeader>
                        <DialogTitle>{t("titleEditDialog")}</DialogTitle>
                        <DialogDescription>
                            {t("descriptionEditDialog")}
                        </DialogDescription>
                    </DialogHeader>
                    <FormCategory category={item} totalPercentage={totalPercentage} setOpenPopover={setOpenEditCatDialog} />
                </DialogContent>
            </Dialog>
            <Button variant="outline" className='mt-2' onClick={() => deleteCategory(item.id)}>
                <Trash /> {t('deleteButton')}
            </Button>
        </PopoverContent>
    </Popover>
}

export default EditPopover