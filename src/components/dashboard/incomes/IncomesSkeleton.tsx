import { Skeleton } from "@/components/ui/skeleton";

export function IncomesSkeleton() {
    return (
        <div className="space-y-6">
            {/* Summary Cards Skeleton */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((index) => (
                    <div key={index} className="rounded-lg border p-6 space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-3 w-full" />
                    </div>
                ))}
            </div>

            {/* Data Table Skeleton */}
            <div className="rounded-lg border">
                <div className="p-4 border-b">
                    <Skeleton className="h-10 w-full max-w-sm" />
                </div>
                <div className="p-4 space-y-4">
                    {[1, 2, 3, 4, 5].map((index) => (
                        <div key={index} className="flex items-center space-x-4">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
