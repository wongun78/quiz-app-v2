import { useState, useEffect } from "react";
import { roleService } from "@/services";
import type { RoleResponse, PageResponse } from "@/types/backend";
import type { RoleSearchParams } from "@/types/role";
import { toast } from "react-toastify";

interface UseRolesOptions extends RoleSearchParams {
  autoFetch?: boolean;
}

interface UseRolesReturn {
  roles: RoleResponse[];
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  totalElements: number;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching roles with search/filter
 * Usage: const { roles, isLoading, error, refetch } = useRoles({ name: "ROLE_ADMIN", page: 0, size: 10 });
 */
export const useRoles = (options: UseRolesOptions = {}): UseRolesReturn => {
  const { name, page = 0, size = 10, autoFetch = true } = options;

  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchRoles = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let response: PageResponse<RoleResponse>;

      // Use search endpoint if name filter is provided
      if (name) {
        response = await roleService.search(name, { page, size });
      } else {
        response = await roleService.getAll({ page, size });
      }

      setRoles(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Failed to fetch roles";
      setError(errorMessage);
      // Don't show toast here - let the component decide whether to show error
      // toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchRoles();
    }
  }, [name, page, size, autoFetch]);

  return {
    roles,
    isLoading,
    error,
    totalPages,
    totalElements,
    refetch: fetchRoles,
  };
};

/**
 * Custom hook for fetching single role
 */
export const useRole = (id: string | undefined) => {
  const [role, setRole] = useState<RoleResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRole = async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await roleService.getById(id);
      setRole(response);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Failed to fetch role";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRole();
  }, [id]);

  return {
    role,
    isLoading,
    error,
    refetch: fetchRole,
  };
};
