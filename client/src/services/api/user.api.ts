import axiosInstance from "@/config/axios.config";
import type {
  ApiResponse,
  PageResponse,
  UserResponse,
  UserRequest,
  PaginationParams,
} from "@/types/backend";
import { API_ENDPOINTS } from "@/config/constants";

class UserService {
  async getAll(params?: PaginationParams): Promise<PageResponse<UserResponse>> {
    const response = await axiosInstance.get<
      ApiResponse<PageResponse<UserResponse>>
    >(API_ENDPOINTS.USERS.BASE, { params });
    return response.data!;
  }

  async search(
    fullName?: string,
    active?: boolean,
    params?: PaginationParams
  ): Promise<PageResponse<UserResponse>> {
    const response = await axiosInstance.get<
      ApiResponse<PageResponse<UserResponse>>
    >(API_ENDPOINTS.USERS.SEARCH, {
      params: { fullName, active, ...params },
    });
    return response.data!;
  }

  async getById(id: string): Promise<UserResponse> {
    const response = await axiosInstance.get<ApiResponse<UserResponse>>(
      API_ENDPOINTS.USERS.BY_ID(id)
    );
    return response.data!;
  }

  async getByEmail(email: string): Promise<UserResponse> {
    const response = await axiosInstance.get<ApiResponse<UserResponse>>(
      API_ENDPOINTS.USERS.BY_EMAIL(email)
    );
    return response.data!;
  }

  async create(data: UserRequest): Promise<UserResponse> {
    const response = await axiosInstance.post<ApiResponse<UserResponse>>(
      API_ENDPOINTS.USERS.BASE,
      data
    );
    return response.data!;
  }

  async update(id: string, data: UserRequest): Promise<UserResponse> {
    const response = await axiosInstance.put<ApiResponse<UserResponse>>(
      API_ENDPOINTS.USERS.BY_ID(id),
      data
    );
    return response.data!;
  }

  async delete(id: string): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.USERS.BY_ID(id));
  }
}

export const userService = new UserService();
