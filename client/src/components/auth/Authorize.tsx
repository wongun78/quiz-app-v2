import { type ReactNode } from "react";
import { usePermission } from "@/hooks/usePermission";

interface AuthorizeProps {
  roles?: string | string[];

  permissions?: string | string[];

  action?: string;
  resource?: string;

  fallback?: ReactNode;

  children: ReactNode;

  requireAll?: boolean;
}

export const Authorize = ({
  roles,
  permissions,
  action,
  resource,
  fallback,
  children,
  requireAll = false,
}: AuthorizeProps) => {
  const { hasRole, hasPermission, can, isAuthenticated } = usePermission();

  if (!isAuthenticated) {
    return <>{fallback || null}</>;
  }

  const checks: boolean[] = [];

  if (roles) {
    checks.push(hasRole(roles));
  }

  if (permissions) {
    checks.push(hasPermission(permissions));
  }

  if (action && resource) {
    checks.push(can(action, resource));
  }

  if (checks.length === 0) {
    return <>{children}</>;
  }

  const hasAccess = requireAll
    ? checks.every((check) => check === true) // AND logic
    : checks.includes(true); // OR logic

  if (hasAccess) {
    return <>{children}</>;
  }

  return <>{fallback || null}</>;
};
