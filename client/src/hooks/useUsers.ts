import { useState, useEffect } from "react";
import { userService } from "@/services";
import type { UserResponse, PageResponse } from "@/types/backend";
import { toast } from "react-toastify";

interface UseUsersOptions {
  fullName?: string;
  active?: boolean;
  page?: number;
  size?: number;
  autoFetch?: boolean;
}

interface UseUsersReturn {
  users: UserResponse[];
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  totalElements: number;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching users with search/filter
 * Usage: const { users, isLoading, error, refetch } = useUsers({ fullName: "Admin", page: 0, size: 10 });
 */
export const useUsers = (options: UseUsersOptions = {}): UseUsersReturn => {
  const { fullName, active, page = 0, size = 10, autoFetch = true } = options;

  const [users, setUsers] = useState<UserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let response: PageResponse<UserResponse>;

      // Use search endpoint if filters are provided
      if (fullName !== undefined || active !== undefined) {
        response = await userService.search(fullName, active, { page, size });
      } else {
        response = await userService.getAll({ page, size });
      }

      setUsers(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Failed to fetch users";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchUsers();
    }
  }, [fullName, active, page, size, autoFetch]);

  return {
    users,
    isLoading,
    error,
    totalPages,
    totalElements,
    refetch: fetchUsers,
  };
};

/**
 * Custom hook for fetching single user
 */
export const useUser = (id: string | undefined) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await userService.getById(id);
      setUser(response);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Failed to fetch user";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  return { user, isLoading, error, refetch: fetchUser };
};
