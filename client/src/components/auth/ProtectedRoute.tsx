import { Navigate, useLocation } from "react-router-dom";
import { Suspense, type ReactNode } from "react";

import { useAuth } from "@/contexts";
import { ROUTES } from "@/config/constants";

import { LoadingFallback } from "@/components/error/ErrorBoundary";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string[];
}

export const ProtectedRoute = ({
  children,
  requiredRole,
}: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingFallback message="Checking authentication..." />;
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        state={{ returnUrl: location.pathname }}
        replace
      />
    );
  }

  // Authenticated but checking role permissions
  if (requiredRole && user) {
    const userRoles = new Set(user.roles);
    const hasPermission = requiredRole.some((role) => userRoles.has(role));

    // Authenticated but no permission - show 403
    if (!hasPermission) {
      return <Navigate to={ROUTES.FORBIDDEN} replace />;
    }
  }

  return (
    <Suspense fallback={<LoadingFallback message="Loading content..." />}>
      {children}
    </Suspense>
  );
};
