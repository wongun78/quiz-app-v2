import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
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

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const refetchUser = useCallback(async () => {
    dispatch({ type: "AUTH_START" });
    try {
      const user = await authService.getCurrentUser();
      dispatch({ type: "AUTH_SUCCESS", payload: user });
    } catch (error: any) {
      // Clear tokens on any auth error (401, 403, invalid token, etc.)
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      dispatch({ type: "AUTH_FAILURE" });

      // Only show error if it's not a normal 401/403
      if (
        error?.response?.status &&
        ![401, 403].includes(error.response.status)
      ) {
        console.error("Auth check failed:", error);
      }
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout API failed", error);
    } finally {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      dispatch({ type: "LOGOUT" });
      toast.info("Logged out successfully");
    }
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    dispatch({ type: "AUTH_START" });
    try {
      const response = await authService.login(data);
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.token);
      dispatch({ type: "AUTH_SUCCESS", payload: response.user });
      toast.success("Login successful!");
    } catch (error: any) {
      dispatch({ type: "AUTH_FAILURE" });
      const msg = error?.response?.data?.message || "Login failed";
      toast.error(msg);
      throw error;
    }
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    dispatch({ type: "AUTH_START" });
    try {
      const response = await authService.register(data);
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.token);
      dispatch({ type: "AUTH_SUCCESS", payload: response.user });
      toast.success("Registration successful!");
    } catch (error: any) {
      dispatch({ type: "AUTH_FAILURE" });
      const msg = error?.response?.data?.message || "Registration failed";
      toast.error(msg);
      throw error;
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      refetchUser();
    } else {
      dispatch({ type: "AUTH_FAILURE" });
    }
  }, [refetchUser]);

  useEffect(() => {
    const handleAuthLogout = () => {
      logout();
      toast.info("Session expired. Please login again.");
    };

    globalThis.addEventListener("auth:logout", handleAuthLogout);
    return () =>
      globalThis.removeEventListener("auth:logout", handleAuthLogout);
  }, [logout]);

  const contextValue = useMemo(
    () => ({
      ...state,
      login,
      register,
      logout,
      refetchUser,
    }),
    [state, login, register, logout, refetchUser],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
