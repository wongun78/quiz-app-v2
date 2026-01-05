import { Skeleton } from "@/components/ui/skeleton";

export const QuizDetailSkeleton = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Header skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-6 w-1/3" />
      </div>

      {/* Image skeleton */}
      <Skeleton className="h-64 w-full rounded-lg" />

      {/* Description skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-4/5" />
      </div>

      {/* Info cards skeleton */}
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }, (_, i) => i).map((id) => (
          <div
            key={`info-card-${id}`}
            className="space-y-2 rounded-lg border border-slate-200 p-4 dark:border-slate-700"
          >
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </div>

      {/* Questions list skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        {Array.from({ length: 5 }, (_, i) => i).map((qId) => (
          <div
            key={`question-${qId}`}
            className="space-y-2 rounded-lg border border-slate-200 p-4 dark:border-slate-700"
          >
            <Skeleton className="h-5 w-full" />
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 4 }, (_, i) => `${qId}-${i}`).map((aId) => (
                <Skeleton
                  key={`answer-${aId}`}
                  className="h-10 w-full rounded-md"
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Action buttons skeleton */}
      <div className="flex gap-4">
        <Skeleton className="h-12 w-32" />
        <Skeleton className="h-12 w-32" />
      </div>
    </div>
  );
};
