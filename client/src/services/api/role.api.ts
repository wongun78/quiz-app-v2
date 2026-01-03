import axiosInstance from "@/config/axios.config";
import type {
  ApiResponse,
  PageResponse,
  RoleResponse,
  RoleRequest,
  PaginationParams,
} from "@/types/backend";

/**
 * Role API Service
 * Handles all role-related API calls
 */
class RoleService {
  private readonly basePath = "/roles";

  /**
   * Get all roles (paginated) - ADMIN only
   */
  async getAll(params?: PaginationParams): Promise<PageResponse<RoleResponse>> {
    const response = await axiosInstance.get<
      ApiResponse<PageResponse<RoleResponse>>
    >(this.basePath, { params });
    return response.data!;
  }

  /**
   * Search roles - ADMIN only
   */
  async search(
    name?: string,
    params?: PaginationParams
  ): Promise<PageResponse<RoleResponse>> {
    const response = await axiosInstance.get<
      ApiResponse<PageResponse<RoleResponse>>
    >(`${this.basePath}/search`, {
      params: { name, ...params },
    });
    return response.data!;
  }

  /**
   * Get role by ID - ADMIN only
   */
  async getById(id: string): Promise<RoleResponse> {
    const response = await axiosInstance.get<ApiResponse<RoleResponse>>(
      `${this.basePath}/${id}`
    );
    return response.data!;
  }

  /**
   * Create new role - ADMIN only
   */
  async create(data: RoleRequest): Promise<RoleResponse> {
    const response = await axiosInstance.post<ApiResponse<RoleResponse>>(
      this.basePath,
      data
    );
    return response.data!;
  }

  /**
   * Update role - ADMIN only
   */
  async update(id: string, data: RoleRequest): Promise<RoleResponse> {
    const response = await axiosInstance.put<ApiResponse<RoleResponse>>(
      `${this.basePath}/${id}`,
      data
    );
    return response.data!;
  }

  /**
   * Delete role - ADMIN only
   */
  async delete(id: string): Promise<void> {
    await axiosInstance.delete(`${this.basePath}/${id}`);
  }
}

// Export singleton instance
export const roleService = new RoleService();
