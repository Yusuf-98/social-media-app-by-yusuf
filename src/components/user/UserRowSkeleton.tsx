import { Skeleton } from "@/components/ui/skeleton";

export function UserRowSkeleton() {
  return (
    <div className="gap-md flex w-full items-center justify-between">
      <div className="gap-md flex min-w-0 flex-1 items-center">
        <Skeleton className="size-12 shrink-0 rounded-full" />
        <div className="gap-xs flex min-w-px flex-1 flex-col items-start">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-10 w-24 shrink-0 rounded-full" />
    </div>
  );
}
