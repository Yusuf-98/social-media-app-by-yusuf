import { Skeleton } from "@/components/ui/skeleton";

export function CommentItemSkeleton() {
  return (
    <div className="gap-md pb-md flex w-full flex-col items-start border-b border-neutral-900 last:border-b-0 md:gap-2.5">
      <div className="gap-md flex w-full items-center">
        <Skeleton className="size-10 shrink-0 rounded-full" />
        <div className="gap-xs flex min-w-px flex-1 flex-col items-start">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-14" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
    </div>
  );
}
