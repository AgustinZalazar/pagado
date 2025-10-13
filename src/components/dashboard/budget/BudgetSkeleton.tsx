import { Skeleton } from "@/components/ui/skeleton";

export function BudgetSkeleton() {
    return (
        <>
            {/* Button skeleton */}
            <Skeleton className="h-10 w-48 mb-4" />

            {/* Cards grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((index) => (
                    <div key={index} className="rounded-lg border p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-6 w-6 rounded-full" />
                        </div>
                        <Skeleton className="h-8 w-24" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
