import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { Mutex } from "async-mutex";
import { toast } from "react-toastify";
import { STORAGE_KEYS, HTTP_STATUS, ERROR_MESSAGES, ROUTES } from "./constants";
import type { ApiResponse, AuthResponse } from "@/types/backend";
import { API_BASE_URL, env } from "./env";

const mutex = new Mutex();
const NO_RETRY_HEADER = "x-no-retry";

let refreshTokenPromise: Promise<string | null> | null = null;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: env.apiTimeout,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: AxiosError) => {
    throw error;
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },

  async (error: AxiosError) => {
    const { response, config } = error;

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
        if (!config?.url?.includes("/auth/")) {
          handleForbidden();
        }
        break;

      case HTTP_STATUS.NOT_FOUND: // 404
        break;

      case HTTP_STATUS.INTERNAL_SERVER_ERROR: // 500
        break;

      case HTTP_STATUS.BAD_REQUEST: // 400
      case HTTP_STATUS.CONFLICT: // 409
        break;

      default:
        break;
    }

    throw error;
  },
);

/**
 * Handle refresh token with mutex to prevent race conditions
 */
const handleRefreshToken = async (): Promise<string | null> => {
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
          withCredentials: true,
        },
      );

      const newToken = response.data?.token;

      if (newToken) {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newToken);
        return newToken;
      }

      return null;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Refresh token failed:", error);
      }
      return null;
    } finally {
      refreshTokenPromise = null;
    }
  });

  return refreshTokenPromise;
};

/**
 * Handle 401 Unauthorized
 */
const handleUnauthorized = () => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_INFO);

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
  const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  const userInfo = localStorage.getItem(STORAGE_KEYS.USER_INFO);

  if (!accessToken || !userInfo) {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_INFO);
    return;
  }

  toast.error(ERROR_MESSAGES.FORBIDDEN);

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
