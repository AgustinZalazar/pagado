import React from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Category } from '@/types/category';
import { Home } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import EditPopover from './EditPopover';
import { getIconComponent } from '@/data/icons';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

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
        <div
            className="
    grid gap-4
    grid-cols-1
    sm:grid-cols-2
    md:grid-cols-3
    lg:grid-cols-4
    xl:grid-cols-5
  "
        >
            {categories.length > 0 ? (
                categories.map((item) => {
                    const IconComponent = getIconComponent(item.icon);
                    return (
                        <Card
                            key={item.id}
                            className={cn(
                                "overflow-hidden relative w-full rounded-xl shadow-md transition-colors",
                                // Fondo adaptado al tema
                                "bg-white border border-neutral-200",
                                "dark:bg-neutral-900 dark:border-neutral-700"
                            )}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div
                                        className={cn(
                                            "p-2 rounded-md",
                                            // En light el ícono se resalta sobre gris claro
                                            "bg-neutral-100",
                                            // En dark lo mismo pero invertido
                                            "dark:bg-neutral-800"
                                        )}
                                    >
                                        {item.icon ? (
                                            <IconComponent
                                                style={{ color: item.color }}
                                                className="w-5 h-5"
                                            />
                                        ) : (
                                            <Home
                                                style={{ color: item.color }}
                                                className="w-5 h-5"
                                            />
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <EditPopover
                                            item={item}
                                            totalPercentage={totalPercentage}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h3
                                        className={cn(
                                            "text-2xl font-bold tracking-tight",
                                            "text-neutral-800 dark:text-neutral-100"
                                        )}
                                    >
                                        {item.nombre}
                                    </h3>
                                    <p
                                        className={cn(
                                            "text-sm",
                                            "text-neutral-500 dark:text-neutral-400"
                                        )}
                                    >
                                        {item.porcentaje}%
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter className="p-0">
                                <Progress
                                    value={item.porcentaje}
                                    className={cn(
                                        "h-1 w-full rounded-none",
                                        // Progress bar visible en ambos modos
                                        "bg-neutral-100 dark:bg-neutral-800"
                                    )}
                                />
                            </CardFooter>
                        </Card>
                    );
                })
            ) : (
                <h2 className="text-xl font-bold m-4 text-center">
                    Por favor ingrese una categoría
                </h2>
            )}
        </div>

    )
}

export default CardsContainer