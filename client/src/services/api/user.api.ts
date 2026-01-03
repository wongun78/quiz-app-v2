import axiosInstance from "@/config/axios.config";
import type {
  ApiResponse,
  PageResponse,
  UserResponse,
  UserRequest,
  PaginationParams,
} from "@/types/backend";

/**
 * User API Service
 * Handles all user-related API calls
 */
class UserService {
  private readonly basePath = "/users";

  /**
   * Get all users (paginated) - ADMIN only
   */
  async getAll(params?: PaginationParams): Promise<PageResponse<UserResponse>> {
    const response = await axiosInstance.get<
      ApiResponse<PageResponse<UserResponse>>
    >(this.basePath, { params });
    return response.data!;
  }

  /**
   * Search users - ADMIN only
   */
  async search(
    fullName?: string,
    active?: boolean,
    params?: PaginationParams
  ): Promise<PageResponse<UserResponse>> {
    const response = await axiosInstance.get<
      ApiResponse<PageResponse<UserResponse>>
    >(`${this.basePath}/search`, {
      params: { fullName, active, ...params },
    });
    return response.data!;
  }

  /**
   * Get user by ID - ADMIN only
   */
  async getById(id: string): Promise<UserResponse> {
    const response = await axiosInstance.get<ApiResponse<UserResponse>>(
      `${this.basePath}/${id}`
    );
    return response.data!;
  }

  /**
   * Get user by email
   */
  async getByEmail(email: string): Promise<UserResponse> {
    const response = await axiosInstance.get<ApiResponse<UserResponse>>(
      `${this.basePath}/email/${email}`
    );
    return response.data!;
  }

  /**
   * Create new user - ADMIN only
   */
  async create(data: UserRequest): Promise<UserResponse> {
    const response = await axiosInstance.post<ApiResponse<UserResponse>>(
      this.basePath,
      data
    );
    return response.data!;
  }

  /**
   * Update user - ADMIN only
   */
  async update(id: string, data: UserRequest): Promise<UserResponse> {
    const response = await axiosInstance.put<ApiResponse<UserResponse>>(
      `${this.basePath}/${id}`,
      data
    );
    return response.data!;
  }

  /**
   * Delete user (soft delete) - ADMIN only
   */
  async delete(id: string): Promise<void> {
    await axiosInstance.delete(`${this.basePath}/${id}`);
  }
}

// Export singleton instance
export const userService = new UserService();
