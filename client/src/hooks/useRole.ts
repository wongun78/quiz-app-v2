import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roleService } from "@/services";
import type { RoleResponse, PageResponse } from "@/types/backend";
import { toast } from "react-toastify";

interface UseRolesOptions {
  name?: string;
  page?: number;
  size?: number;
}

export const useRoles = (options: UseRolesOptions = {}) => {
  const { name, page = 0, size = 10 } = options;

  return useQuery({
    queryKey: ["roles", { name, page, size }],
    queryFn: async () => {
      try {
        let response: PageResponse<RoleResponse>;

        if (name) {
          response = await roleService.search(name, { page, size });
        } else {
          response = await roleService.getAll({ page, size });
        }

        return response;
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message || "Failed to fetch roles";
        toast.error(errorMessage);
        throw err;
      }
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useRole = (id: string | undefined) => {
  return useQuery({
    queryKey: ["role", id],
    queryFn: async () => {
      if (!id) throw new Error("Role ID is required");

      try {
        const response = await roleService.getById(id);
        return response;
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message || "Failed to fetch role";
        toast.error(errorMessage);
        throw err;
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => roleService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role created successfully!");
    },
    onError: (err: any) => {
      const errorMessage =
        err?.response?.data?.message || "Failed to create role";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      roleService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["role", variables.id] });
      toast.success("Role updated successfully!");
    },
    onError: (err: any) => {
      const errorMessage =
        err?.response?.data?.message || "Failed to update role";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => roleService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role deleted successfully!");
    },
    onError: (err: any) => {
      const errorMessage =
        err?.response?.data?.message || "Failed to delete role";
      toast.error(errorMessage);
    },
  });
};
