import { Skeleton } from "@/components/ui/skeleton";

export function PostDetailSkeleton() {
  return (
    <div className="gap-3xl mx-auto flex w-full max-w-300 flex-col lg:grid lg:aspect-5/3 lg:grid-cols-[3fr_2fr] lg:items-stretch lg:gap-0">
      {/* Image */}
      <Skeleton className="relative aspect-square w-full min-w-0 rounded-none" />

      {/* Post Container */}
      <div className="lg:p-2xl flex w-full min-w-0 flex-col items-start gap-11.5 lg:overflow-hidden">
        {/* Post Header */}
        <div className="gap-sm flex w-full flex-col items-start">
          <div className="gap-md flex w-full items-center">
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <div className="gap-xs flex flex-1 flex-col items-start">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-neutral-900" />

        {/* Comments Section */}
        <div className="gap-xl flex w-full flex-1 flex-col items-start">
          <Skeleton className="h-4 w-24" />
          <div className="gap-xl flex w-full flex-col items-start">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="gap-md pb-md flex w-full flex-col items-start border-b border-neutral-900 last:border-b-0"
              >
                <div className="gap-md flex w-full items-center">
                  <Skeleton className="size-10 shrink-0 rounded-full" />
                  <div className="gap-xs flex flex-1 flex-col items-start">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-14" />
                  </div>
                </div>
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
