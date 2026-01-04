import axiosInstance from "@/config/axios.config";
import type {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UserResponse,
} from "@/types/backend";
import { STORAGE_KEYS, API_ENDPOINTS } from "@/config/constants";

class AuthService {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.LOGIN,
      data
    );
    return response.data || ({} as AuthResponse);
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );
    return response.data || ({} as AuthResponse);
  }

  async refreshToken(): Promise<AuthResponse> {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.REFRESH,
      {},
      { withCredentials: true }
    );
    return response.data || ({} as AuthResponse);
  }

  async logout(): Promise<void> {
    try {
      await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
    } finally {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_INFO);
    }
  }

  async getCurrentUser(): Promise<UserResponse> {
    const response = await axiosInstance.get<ApiResponse<UserResponse>>(
      API_ENDPOINTS.AUTH.ME
    );
    return response.data || ({} as UserResponse);
  }
}

export const authService = new AuthService();
