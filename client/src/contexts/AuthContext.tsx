import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { authService } from "@/services";
import { STORAGE_KEYS } from "@/config/constants";
import type {
  UserResponse,
  LoginRequest,
  RegisterRequest,
} from "@/types/backend";
import { toast } from "react-toastify";

// ===========================
// Types & Interfaces
// ===========================

interface AuthState {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

type AuthAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: UserResponse }
  | { type: "AUTH_FAILURE" }
  | { type: "LOGOUT" };

interface AuthContextValue extends AuthState {
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

// ===========================
// Reducer
// ===========================

const initialUnauthenticatedState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, isLoading: true };

    case "AUTH_SUCCESS":
      return {
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };

    case "AUTH_FAILURE":
    case "LOGOUT":
      return initialUnauthenticatedState;

    default:
      return state;
  }
};

// ===========================
// Context Creation
// ===========================

const AuthContext = createContext<AuthContextValue | null>(null);

// ===========================
// Provider Component
// ===========================

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Auto-fetch user on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      refetchUser();
    } else {
      dispatch({ type: "AUTH_FAILURE" });
    }
  }, []);

  // Listen to logout events from axios interceptor
  useEffect(() => {
    const handleAuthLogout = () => {
      dispatch({ type: "LOGOUT" });
      toast.info("Session expired. Please login again.");
    };

    globalThis.addEventListener("auth:logout", handleAuthLogout);
    return () =>
      globalThis.removeEventListener("auth:logout", handleAuthLogout);
  }, []);

  /**
   * Login user
   */
  const login = async (data: LoginRequest): Promise<void> => {
    dispatch({ type: "AUTH_START" });

    try {
      const response = await authService.login(data);

      // Save token
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.token);

      // Save user info
      dispatch({ type: "AUTH_SUCCESS", payload: response.user });

      toast.success("Login successful!");
    } catch (error: any) {
      dispatch({ type: "AUTH_FAILURE" });

      const errorMessage = error?.response?.data?.message || "Login failed";
      toast.error(errorMessage);

      throw error;
    }
  };

  /**
   * Register new user
   */
  const register = async (data: RegisterRequest): Promise<void> => {
    dispatch({ type: "AUTH_START" });

    try {
      const response = await authService.register(data);

      // Save token
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.token);

      // Save user info
      dispatch({ type: "AUTH_SUCCESS", payload: response.user });

      toast.success("Registration successful!");
    } catch (error: any) {
      dispatch({ type: "AUTH_FAILURE" });

      const errorMessage =
        error?.response?.data?.message || "Registration failed";
      toast.error(errorMessage);

      throw error;
    }
  };

  /**
   * Logout user
   */
  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
      dispatch({ type: "LOGOUT" });
      toast.success("Logged out successfully");
    } catch (_error) {
      // Even if API call fails, clear local state
      dispatch({ type: "LOGOUT" });
      toast.info("Logged out locally");
    }
  };

  /**
   * Refetch current user
   */
  const refetchUser = async (): Promise<void> => {
    dispatch({ type: "AUTH_START" });

    try {
      const user = await authService.getCurrentUser();
      dispatch({ type: "AUTH_SUCCESS", payload: user });
    } catch (error: any) {
      // Only logout if it's 401/403 (authentication issue)
      // Don't logout on network errors or 500
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        dispatch({ type: "AUTH_FAILURE" });
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      } else {
        // For other errors, keep the user logged in but set loading to false
        dispatch({ type: "AUTH_FAILURE" });
      }
    }
  };

  const contextValue = useMemo(
    () => ({
      ...state,
      login,
      register,
      logout,
      refetchUser,
    }),
    [state]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// ===========================
// Custom Hook
// ===========================

/**
 * useAuth Hook
 * Access auth context from any component
 */
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
