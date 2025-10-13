import { Skeleton } from "@/components/ui/skeleton";

export const AccountsListSkeleton = () => {
    return (
        <div className="flex flex-wrap gap-4">
            {[1, 2, 3, 4].map((index) => (
                <div
                    key={index}
                    className="rounded-xl overflow-hidden shadow-lg border border-gray-100 w-[395px] flex-shrink-0"
                >
                    <div className="bg-gradient-to-r from-gray-200 to-gray-300 p-6">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div>
                                    <Skeleton className="h-6 w-32 mb-2" />
                                    <Skeleton className="h-4 w-20" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-5 w-5" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-5 w-8 rounded-full" />
                            </div>
                            <Skeleton className="h-4 w-4" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
