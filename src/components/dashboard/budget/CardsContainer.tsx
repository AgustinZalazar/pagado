import React from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Category } from '@/types/category';
import { Home } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import EditPopover from './EditPopover';
import { getIconComponent } from '@/data/icons';
import { Skeleton } from '@/components/ui/skeleton';

const CardSkeleton = () => {
    return (
        <Card className="overflow-hidden relative w-[250px]">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-9 w-9 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-4 w-16" />
                </div>
            </CardContent>
            <CardFooter className="p-0">
                <Skeleton className="h-1 w-full" />
            </CardFooter>
        </Card>
    );
};

interface Props {
    categories: Category[]
    type: "category" | "method";
    isLoading?: boolean;
}

const CardsContainer = ({ categories, type, isLoading }: Props) => {
    const totalPercentage = categories?.reduce((sum, category) => sum + (+category.porcentaje || 0), 0);

    if (isLoading) {
        return (
            <div className='flex flex-row flex-wrap gap-4'>
                {[1, 2, 3, 4, 5, 6].map((index) => (
                    <CardSkeleton key={index} />
                ))}
            </div>
        );
    }

    return (
        <div className='flex flex-row flex-wrap gap-4'>
            {categories.length > 0 ?
                categories.map((item) => {
                    const IconComponent = getIconComponent(item.icon);
                    return (
                        <Card className="overflow-hidden relative w-[250px]" key={item.id}>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 rounded-md bg-primary/10">
                                        {item.icon ?
                                            <IconComponent style={{ color: item.color }} className="w-5 h-5" />
                                            :
                                            <Home style={{ color: item.color }} className='w-5 h-5' />
                                        }
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {/* <span className="text-sm text-muted-foreground">#{item.id}</span> */}
                                        <EditPopover item={item} totalPercentage={totalPercentage} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-bold tracking-tight">{item.nombre}</h3>
                                    <p className="text-sm text-muted-foreground">{item.porcentaje}%</p>
                                </div>
                            </CardContent>
                            <CardFooter className="p-0">
                                <Progress value={item.porcentaje} className="h-1 w-full rounded-none" />
                            </CardFooter>
                        </Card>
                    )
                })
                :
                <h2 className="text-xl font-bold m-4 text-center"> Por favor ingrese una categoria</h2>
            }
        </div>
    )
}

export default CardsContainer