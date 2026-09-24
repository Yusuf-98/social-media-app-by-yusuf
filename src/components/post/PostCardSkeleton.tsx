import { Skeleton } from "@/components/ui/skeleton";

export function PostCardSkeleton() {
  return (
    <div className="gap-md md:gap-lg flex w-full flex-col items-start">
      {/* Post Container */}
      <div className="gap-md md:gap-lg flex w-full flex-col items-start">
        {/* Header */}
        <div className="flex w-full items-center">
          <div className="gap-md md:gap-lg flex items-center">
            <Skeleton className="size-11 shrink-0 rounded-full md:size-[clamp(44px,21.14px+2.98vw,64px)]" />
            <div className="flex flex-col items-start">
              <div className="flex h-7 items-center md:h-7.5">
                <Skeleton className="h-4 w-32 md:h-5 md:w-40" />
              </div>
              <div className="flex h-4 items-center md:h-7">
                <Skeleton className="h-3 w-20 md:h-4 md:w-24" />
              </div>
            </div>
          </div>
        </div>

        {/* Image */}
        <Skeleton className="aspect-square max-h-150 w-full rounded-md" />
      </div>

      {/* Actions */}
      <div className="flex h-7 w-full items-center justify-between md:h-7.5">
        <div className="gap-lg md:gap-xl flex items-center">
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-6 w-12" />
          <Skeleton className="size-6" />
        </div>
        <Skeleton className="size-6" />
      </div>

      {/* Post Content */}
      <div className="md:gap-xs flex w-full flex-col items-start gap-0 md:w-131.5">
        <div className="flex h-7 items-center md:h-7.5">
          <Skeleton className="h-4 w-28 md:h-5 md:w-36" />
        </div>
        <div className="gap-xxs flex h-14 w-full flex-col justify-center md:h-15">
          <Skeleton className="h-4 w-full md:h-5" />
          <Skeleton className="h-4 w-2/3 md:h-5" />
        </div>
        <div className="flex h-7 items-center md:h-7.5">
          <Skeleton className="h-4 w-20 md:h-5" />
        </div>
      </div>
    </div>
  );
}

export function FeedSkeleton() {
  return (
    <div className="gap-xl md:gap-3xl flex w-full flex-col">
      <PostCardSkeleton />
      <div className="h-px w-full bg-neutral-900" />
      <PostCardSkeleton />
    </div>
  );
}
