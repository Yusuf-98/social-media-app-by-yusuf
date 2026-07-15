import { Skeleton } from "@/components/ui/skeleton";

export function PostGridSkeleton() {
  return (
    <div className="gap-xxs md:gap-xs grid w-full grid-cols-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <Skeleton key={i} className="aspect-square w-full rounded-xs md:rounded-sm" />
      ))}
    </div>
  );
}
