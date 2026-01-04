import { useState, type ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;

  skeletonColor?: string;

  loading?: "lazy" | "eager";

  decoding?: "async" | "sync" | "auto";
}

export function OptimizedImage({
  src,
  alt,
  className,
  skeletonColor = "bg-muted",
  loading = "lazy",
  decoding = "async",
  ...props
}: Readonly<OptimizedImageProps>) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Skeleton placeholder */}
      {isLoading && (
        <div
          className={cn("absolute inset-0 animate-pulse", skeletonColor)}
          aria-hidden="true"
        />
      )}

      {/* Error fallback */}
      {hasError ? (
        <div
          className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground"
          aria-live="polite"
          aria-label={`Failed to load image: ${alt}`}
        >
          <div className="text-center p-4">
            <svg
              className="mx-auto h-12 w-12 text-muted-foreground/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="mt-2 text-sm">Image not available</p>
          </div>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={loading}
          decoding={decoding}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100",
            className
          )}
          {...props}
        />
      )}
    </div>
  );
}

export function HeroImage({
  className,
  ...props
}: Readonly<OptimizedImageProps>) {
  return (
    <OptimizedImage
      loading="eager"
      decoding="async"
      className={cn("w-full", className)}
      {...props}
    />
  );
}

export function ThumbnailImage({
  className,
  ...props
}: Readonly<OptimizedImageProps>) {
  return (
    <OptimizedImage
      loading="lazy"
      decoding="async"
      className={cn("object-cover", className)}
      {...props}
    />
  );
}
