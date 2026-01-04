import { useCallback, useMemo } from "react";
import { useAuth } from "@/contexts";
import { ROLES } from "@/config/constants";

const ROLE_PERMISSIONS: Record<string, string[]> = {
  [ROLES.ADMIN]: [
    "quiz:view",
    "quiz:create",
    "quiz:edit",
    "quiz:delete",
    "question:view",
    "question:create",
    "question:edit",
    "question:delete",
    "user:view",
    "user:create",
    "user:edit",
    "user:delete",
    "role:view",
    "role:create",
    "role:edit",
    "role:delete",
    "dashboard:view",
  ],
  [ROLES.USER]: ["quiz:view", "quiz:take"],
};

export const usePermission = () => {
  const { user } = useAuth();

  const currentPermissions = useMemo(() => {
    if (!user?.roles) return [];

    const permissions = new Set<string>();

    user.roles.forEach((role) => {
      const rolePerms = ROLE_PERMISSIONS[role] || [];
      rolePerms.forEach((p) => permissions.add(p));
    });

    return Array.from(permissions);
  }, [user?.roles]);

  const hasRole = useCallback(
    (role: string | string[]): boolean => {
      if (!user?.roles) return false;
      const rolesToCheck = Array.isArray(role) ? role : [role];
      return rolesToCheck.some((r) => user.roles.includes(r));
    },
    [user?.roles]
  );

  const hasPermission = useCallback(
    (permission: string | string[]): boolean => {
      const permissionsToCheck = Array.isArray(permission)
        ? permission
        : [permission];

      return permissionsToCheck.every((p) => currentPermissions.includes(p));
    },
    [currentPermissions]
  );

  const can = useCallback(
    (action: string, resource: string): boolean => {
      const permissionString = `${resource}:${action}`;
      return currentPermissions.includes(permissionString);
    },
    [currentPermissions]
  );

  const cannot = useCallback(
    (action: string, resource: string): boolean => {
      return !can(action, resource);
    },
    [can]
  );

  return {
    user,
    isAuthenticated: !!user,
    roles: user?.roles || [],
    permissions: currentPermissions,

    isAdmin: hasRole(ROLES.ADMIN),
    isUser: hasRole(ROLES.USER),

    hasRole,
    hasPermission,
    can,
    cannot,
  };
};
