import { Skeleton } from "@/components/ui/skeleton";

export const QuizCardSkeleton = () => {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      {/* Image skeleton */}
      <Skeleton className="mb-4 h-48 w-full rounded-md" />

      {/* Title skeleton */}
      <Skeleton className="mb-2 h-6 w-3/4" />

      {/* Description skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      {/* Difficulty badge skeleton */}
      <div className="mt-4 flex items-center gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>

      {/* Button skeleton */}
      <Skeleton className="mt-4 h-10 w-full rounded-md" />
    </div>
  );
};

export const QuizCardListSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => i).map((id) => (
        <QuizCardSkeleton key={`quiz-card-skeleton-${id}`} />
      ))}
    </div>
  );
};
