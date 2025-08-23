import { Skeleton } from "@/components/ui/skeleton"

export function BarChartSkeleton() {
    return (
        <div className="flex items-end justify-between h-full w-full gap-2 px-2">
            {[40, 70, 50, 90, 60, 80].map((h, i) => (
                <Skeleton
                    key={i}
                    className="w-6 sm:w-8 rounded-md animate-pulse"
                    style={{ height: `${h}%` }}
                />
            ))}
        </div>
    )
}