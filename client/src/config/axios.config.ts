import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { Mutex } from "async-mutex";
import { toast } from "react-toastify";
import { API_BASE_URL, IS_DEV } from "./env";
import { STORAGE_KEYS, HTTP_STATUS, ERROR_MESSAGES, ROUTES } from "./constants";
import type { ApiResponse, AuthResponse } from "@/types/backend";

// Mutex to prevent race conditions when refreshing token
const mutex = new Mutex();
const NO_RETRY_HEADER = "x-no-retry";

// Singleton promise for refresh token to avoid multiple refresh calls
let refreshTokenPromise: Promise<string | null> | null = null;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important: Send cookies for refresh token
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (IS_DEV) {
      console.log("Request:", {
        method: config.method?.toUpperCase(),
        url: config.url,
        hasToken: !!accessToken,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    throw error;
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (IS_DEV) {
      console.log("✅ Response:", {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response.data;
  },

  // Error response
  async (error: AxiosError) => {
    const { response, config } = error;

    if (IS_DEV) {
      console.error("❌ Error:", {
        status: response?.status,
        url: config?.url,
        message: error.message,
      });
    }

    if (!response) {
      throw error;
    }

    // Handle 401 with auto-refresh token
    if (
      response.status === HTTP_STATUS.UNAUTHORIZED &&
      config &&
      !config.headers?.[NO_RETRY_HEADER] &&
      config.url !== "/auth/login"
    ) {
      try {
        const newToken = await handleRefreshToken();

        if (newToken) {
          config.headers[NO_RETRY_HEADER] = "true";
          config.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance.request(config);
        }
      } catch (refreshError) {
        handleUnauthorized();
        throw refreshError;
      }
    }

    // Handle other error status codes
    switch (response.status) {
      case HTTP_STATUS.UNAUTHORIZED: // 401
        if (config?.url === "/auth/refresh") {
          handleUnauthorized();
        }
        break;

      case HTTP_STATUS.FORBIDDEN: // 403
        handleForbidden();
        break;

      case HTTP_STATUS.NOT_FOUND: // 404
        toast.error(ERROR_MESSAGES.NOT_FOUND);
        break;

      case HTTP_STATUS.INTERNAL_SERVER_ERROR: // 500
        toast.error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
        break;

      case HTTP_STATUS.BAD_REQUEST: // 400
      case HTTP_STATUS.CONFLICT: // 409
        break;

      default:
        toast.error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    }

    throw error;
  }
);

/**
 * Handle refresh token with mutex to prevent race conditions
 * Uses singleton pattern to avoid multiple refresh calls
 */
const handleRefreshToken = async (): Promise<string | null> => {
  // Return existing promise if refresh is already in progress
  if (refreshTokenPromise) {
    return refreshTokenPromise;
  }

  refreshTokenPromise = mutex.runExclusive(async () => {
    try {
      const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
        "/auth/refresh",
        {},
        {
          headers: { [NO_RETRY_HEADER]: "true" },
          withCredentials: true, // Send refresh token cookie
        }
      );

      const newToken = response.data?.token;

      if (newToken) {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newToken);
        return newToken;
      }

      return null;
    } catch (error) {
      if (IS_DEV) {
        console.error("❌ Refresh token failed:", error);
      }
      return null;
    } finally {
      // Clear promise after completion
      refreshTokenPromise = null;
    }
  });

  return refreshTokenPromise;
};

/**
 * Handle 401 Unauthorized
 */
const handleUnauthorized = () => {
  // Clear auth data
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_INFO);

  // Show notification
  toast.error(ERROR_MESSAGES.UNAUTHORIZED);

  // Redirect to login page
  const currentPath = globalThis.location.pathname;
  const returnUrl =
    currentPath === ROUTES.LOGIN
      ? ""
      : `?returnUrl=${encodeURIComponent(currentPath)}`;

  globalThis.location.href = `${ROUTES.LOGIN}${returnUrl}`;
};

/**
 * Handle 403 Forbidden
 */
const handleForbidden = () => {
  toast.error(ERROR_MESSAGES.FORBIDDEN);

  // Redirect to 403 page if not already there
  if (globalThis.location.pathname !== ROUTES.FORBIDDEN) {
    globalThis.location.href = ROUTES.FORBIDDEN;
  }
};

export default axiosInstance;

/**
 * Helper function to check if error is axios error
 */
export const isAxiosError = (error: unknown): error is AxiosError => {
  return axios.isAxiosError(error);
};

/**
 * Helper to extract error message from API response
 */
export const getErrorMessage = (error: unknown): string => {
  if (isAxiosError(error)) {
    const apiError = error.response?.data as { message?: string };
    return apiError?.message || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
};
