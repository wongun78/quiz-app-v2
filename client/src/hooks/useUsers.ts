import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services";
import type { UserResponse, PageResponse } from "@/types/backend";
import { toast } from "react-toastify";

interface UseUsersOptions {
  fullName?: string;
  active?: boolean;
  page?: number;
  size?: number;
}

export const useUsers = (options: UseUsersOptions = {}) => {
  const { fullName, active, page = 0, size = 10 } = options;

  return useQuery({
    queryKey: ["users", { fullName, active, page, size }],
    queryFn: async () => {
      try {
        let response: PageResponse<UserResponse>;

        if (fullName !== undefined || active !== undefined) {
          response = await userService.search(fullName, active, { page, size });
        } else {
          response = await userService.getAll({ page, size });
        }

        return response;
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message || "Failed to fetch users";
        toast.error(errorMessage);
        throw err;
      }
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useUser = (id: string | undefined) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      if (!id) throw new Error("User ID is required");

      try {
        const response = await userService.getById(id);
        return response;
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message || "Failed to fetch user";
        toast.error(errorMessage);
        throw err;
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => userService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created successfully!");
    },
    onError: (err: any) => {
      const errorMessage =
        err?.response?.data?.message || "Failed to create user";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      userService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", variables.id] });
      toast.success("User updated successfully!");
    },
    onError: (err: any) => {
      const errorMessage =
        err?.response?.data?.message || "Failed to update user";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully!");
    },
    onError: (err: any) => {
      const errorMessage =
        err?.response?.data?.message || "Failed to delete user";
      toast.error(errorMessage);
    },
  });
};
