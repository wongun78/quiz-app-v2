import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export const SectionHeading = ({
  icon,
  title,
  description,
  className,
}: SectionHeadingProps) => (
  <div className={cn("text-center mb-12", className)}>
    {icon && (
      <div className="inline-flex items-center justify-center gap-2 mb-4">
        {icon}
      </div>
    )}
    <h2 className="text-3xl md:text-4xl font-bold text-foreground">{title}</h2>
    {description && (
      <p className="text-muted-foreground mt-2 text-lg">{description}</p>
    )}
  </div>
);
