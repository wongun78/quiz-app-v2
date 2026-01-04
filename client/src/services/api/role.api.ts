import axiosInstance from "@/config/axios.config";
import type {
  ApiResponse,
  PageResponse,
  RoleResponse,
  RoleRequest,
  PaginationParams,
} from "@/types/backend";
import { API_ENDPOINTS } from "@/config/constants";

class RoleService {
  async getAll(params?: PaginationParams): Promise<PageResponse<RoleResponse>> {
    const response = await axiosInstance.get<
      ApiResponse<PageResponse<RoleResponse>>
    >(API_ENDPOINTS.ROLES.BASE, { params });
    return response.data!;
  }

  async search(
    name?: string,
    params?: PaginationParams
  ): Promise<PageResponse<RoleResponse>> {
    const response = await axiosInstance.get<
      ApiResponse<PageResponse<RoleResponse>>
    >(API_ENDPOINTS.ROLES.SEARCH, {
      params: { name, ...params },
    });
    return response.data!;
  }

  async getById(id: string): Promise<RoleResponse> {
    const response = await axiosInstance.get<ApiResponse<RoleResponse>>(
      API_ENDPOINTS.ROLES.BY_ID(id)
    );
    return response.data!;
  }

  async create(data: RoleRequest): Promise<RoleResponse> {
    const response = await axiosInstance.post<ApiResponse<RoleResponse>>(
      API_ENDPOINTS.ROLES.BASE,
      data
    );
    return response.data!;
  }

  async update(id: string, data: RoleRequest): Promise<RoleResponse> {
    const response = await axiosInstance.put<ApiResponse<RoleResponse>>(
      API_ENDPOINTS.ROLES.BY_ID(id),
      data
    );
    return response.data!;
  }

  async delete(id: string): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.ROLES.BY_ID(id));
  }
}

export const roleService = new RoleService();
