import { Skeleton } from "@/components/ui/skeleton";

export function EditProfileSkeleton() {
  return (
    <div className="gap-xl md:gap-6xl flex w-full flex-col items-center md:flex-row md:items-start">
      {/* Avatar */}
      <div className="gap-xl flex shrink-0 flex-col items-center">
        <Skeleton className="size-20 rounded-full md:size-32.5" />
        <Skeleton className="md:h-6xl h-10 w-40 rounded-md" />
      </div>

      {/* Fields */}
      <div className="gap-xl md:gap-3xl flex w-full flex-1 flex-col items-start">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="gap-xxs flex w-full flex-col items-start">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-11 w-full rounded-md" />
          </div>
        ))}
        <Skeleton className="h-11 w-full rounded-md" />
      </div>
    </div>
  );
}
