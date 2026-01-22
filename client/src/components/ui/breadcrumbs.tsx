import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbsProps {
  className?: string;
  customLabels?: Record<string, string>;
}

export function Breadcrumbs({
  className,
  customLabels = {},
}: Readonly<BreadcrumbsProps>) {
  const location = useLocation();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = location.pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    breadcrumbs.push({ label: "Home", path: "/" });

    paths.forEach((segment, index) => {
      const path = `/${paths.slice(0, index + 1).join("/")}`;
      const label = customLabels[segment] || formatLabel(segment);
      breadcrumbs.push({ label, path });
    });

    return breadcrumbs;
  };

  const formatLabel = (segment: string): string => {
    return segment
      .replaceAll(/[-_]/g, " ")
      .replaceAll(/([a-z])([A-Z])/g, "$1 $2")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const breadcrumbs = generateBreadcrumbs();

  if (location.pathname === "/" || breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center space-x-1 text-sm text-muted-foreground",
        className,
      )}
    >
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const isHome = index === 0;

        return (
          <div key={item.path} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 mx-1 shrink-0" />}

            {isLast ? (
              <span className="font-medium text-foreground" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.path}
                className="hover:text-foreground transition-colors flex items-center"
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export function AdminBreadcrumbs({
  className,
}: Readonly<{ className?: string }>) {
  return (
    <Breadcrumbs
      className={className}
      customLabels={{
        admin: "Admin Panel",
        quizzes: "Quiz Management",
        questions: "Question Management",
        users: "User Management",
        roles: "Role Management",
        dashboard: "Dashboard",
      }}
    />
  );
}
