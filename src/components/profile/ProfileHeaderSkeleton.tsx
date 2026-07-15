import { Skeleton } from "@/components/ui/skeleton";

export function ProfileHeaderSkeleton() {
  return (
    <div className="gap-xl flex w-full flex-col items-start">
      <div className="gap-md flex w-full flex-col md:flex-row md:items-center md:justify-between">
        {/* User Info Container */}
        <div className="gap-md md:gap-2xl flex items-center md:items-end">
          <Skeleton className="size-16 shrink-0 rounded-full" />
          <div className="gap-xs flex flex-col items-start">
            <Skeleton className="h-4 w-32 md:h-5 md:w-40" />
            <Skeleton className="h-4 w-24 md:h-5 md:w-28" />
          </div>
        </div>

        {/* Actions Container */}
        <div className="gap-lg flex w-full items-center md:w-auto">
          <Skeleton className="md:h-6xl h-10 flex-1 rounded-full md:w-32.5 md:flex-none" />
          <Skeleton className="md:size-6xl size-10 shrink-0 rounded-full" />
        </div>
      </div>

      {/* Stats Container */}
      <div className="gap-3xl flex w-full items-center">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="gap-xxs flex flex-1 flex-col items-center">
            <Skeleton className="h-5 w-8 md:h-6" />
            <Skeleton className="h-3 w-14" />
          </div>
        ))}
      </div>
    </div>
  );
}
