import { Skeleton } from "@/components/ui/skeleton";

export const QuestionTableSkeleton = ({ rows = 5 }: { rows?: number }) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      {/* Table header */}
      <div className="grid grid-cols-5 gap-4 border-b border-slate-200 p-4 dark:border-slate-700">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-48 col-span-2" />
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-24" />
      </div>

      {/* Table rows */}
      {Array.from({ length: rows }, (_, i) => i).map((id) => (
        <div
          key={`question-skeleton-${id}`}
          className="grid grid-cols-5 gap-4 border-b border-slate-200 p-4 last:border-b-0 dark:border-slate-700"
        >
          <Skeleton className="h-5 w-8" />
          <div className="col-span-2 space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};
