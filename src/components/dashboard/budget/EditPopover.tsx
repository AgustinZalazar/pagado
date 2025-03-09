import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
// import { EllipsisVertical, Trash2 } from 'lucide-react'
import { Edit, Home, MoreVertical, Trash } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DialogWindow } from '../windows/DialogWindow'
import { FormCategory } from './FormCategories'
import { Button } from '@/components/ui/button'
import { Category } from '@/types/category'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useDeleteCategory } from '@/hooks/useGetCategories';

interface Props {
    item: Category,
    totalPercentage: number
}

const EditPopover = ({ item, totalPercentage }: Props) => {
    const [openEditCatDialog, setOpenEditCatDialog] = useState(false)
    const { deleteCategory } = useDeleteCategory()

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
                        <Edit className="w-4 text-gray-600" /> Editar
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:w-[80%]">
                    <DialogHeader>
                        <DialogTitle>Editar categoria</DialogTitle>
                        <DialogDescription>
                            Modifica las categorias
                        </DialogDescription>
                    </DialogHeader>
                    <FormCategory category={item} totalPercentage={totalPercentage} setOpenPopover={setOpenEditCatDialog} />
                </DialogContent>
            </Dialog>
            <Button variant="outline" className='mt-2' onClick={() => deleteCategory(item.id)}>
                <Trash />   Delete
            </Button>
        </PopoverContent>
    </Popover>
}

export default EditPopover