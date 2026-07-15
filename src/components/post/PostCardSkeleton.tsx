import { Skeleton } from "@/components/ui/skeleton";

export function PostCardSkeleton() {
  return (
    <div className="gap-md md:gap-lg flex w-full flex-col items-start">
      {/* Post Container */}
      <div className="gap-md md:gap-lg flex w-full flex-col items-start">
        {/* Header */}
        <div className="gap-md md:gap-lg flex w-full items-center">
          <Skeleton className="size-11 shrink-0 rounded-full md:size-16" />
          <div className="gap-xs flex min-w-px flex-1 flex-col items-start">
            <Skeleton className="h-4 w-32 md:h-5 md:w-40" />
            <Skeleton className="h-3 w-20 md:h-4 md:w-24" />
          </div>
        </div>

        {/* Image */}
        <Skeleton className="aspect-square w-full rounded-md" />
      </div>

      {/* Actions */}
      <div className="flex w-full items-center justify-between">
        <div className="gap-lg md:gap-xl flex items-center">
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-6 w-6" />
        </div>
        <Skeleton className="h-6 w-6" />
      </div>

      {/* Post Content */}
      <div className="gap-xs flex w-full flex-col items-start">
        <Skeleton className="h-4 w-28 md:h-5 md:w-36" />
        <Skeleton className="h-4 w-full md:h-5" />
        <Skeleton className="h-4 w-2/3 md:h-5" />
      </div>
    </div>
  );
}
