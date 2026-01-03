interface EnvConfig {
  apiBaseUrl: string;
  appName: string;
  appVersion: string;
  apiTimeout: number;
  isDevelopment: boolean;
  isProduction: boolean;
  enableDevTools: boolean;
  enableMockData: boolean;
}

const getEnvConfig = (): EnvConfig => {
  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

  return {
    apiBaseUrl,
    appName: import.meta.env.VITE_APP_NAME || "Quiz App",
    appVersion: import.meta.env.VITE_APP_VERSION || "1.0.0",
    apiTimeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    enableDevTools: import.meta.env.VITE_ENABLE_DEV_TOOLS === "true",
    enableMockData: import.meta.env.VITE_ENABLE_MOCK_DATA === "true",
  };
};

export const env = getEnvConfig();

export const API_BASE_URL = env.apiBaseUrl;
export const IS_DEV = env.isDevelopment;
export const IS_PROD = env.isProduction;
