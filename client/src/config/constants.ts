export const ROUTES = {
  // Public routes
  HOME: "/",
  ABOUT: "/about",
  CONTACT: "/contact",
  QUIZZES: "/quizzes",
  QUIZ_DETAIL: (id: string) => `/quizzes/${id}`,

  // Auth routes
  LOGIN: "/login",
  REGISTER: "/register",

  // Exam routes
  TAKE_EXAM: (quizId: string) => `/exam/${quizId}`,
  EXAM_RESULT: (submissionId: string) => `/exam/result/${submissionId}`,

  // Admin routes
  ADMIN: {
    DASHBOARD: "/admin",
    QUIZZES: "/admin/quizzes",
    QUESTIONS: "/admin/questions",
    USERS: "/admin/users",
    ROLES: "/admin/roles",
  },

  // Error routes
  NOT_FOUND: "/404",
  FORBIDDEN: "/403",
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    BASE: "/auth",
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },
  USERS: {
    BASE: "/users",
    SEARCH: "/users/search",
    BY_ID: (id: string) => `/users/${id}`,
    BY_EMAIL: (email: string) => `/users/email/${email}`,
  },
  ROLES: {
    BASE: "/roles",
    SEARCH: "/roles/search",
    BY_ID: (id: string) => `/roles/${id}`,
  },
  QUIZZES: {
    BASE: "/quizzes",
    SEARCH: "/quizzes/search",
    BY_ID: (id: string) => `/quizzes/${id}`,
    DETAILS: (id: string) => `/quizzes/${id}/details`,
    QUESTIONS: (quizId: string) => `/quizzes/${quizId}/questions`,
    REMOVE_QUESTION: (quizId: string, questionId: string) =>
      `/quizzes/${quizId}/questions/${questionId}`,
  },
  QUESTIONS: {
    BASE: "/questions",
    SEARCH: "/questions/search",
    BY_ID: (id: string) => `/questions/${id}`,
  },
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER_INFO: "user_info",
  THEME: "theme",
} as const;

export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,

  PHONE_REGEX: /(84|0[35789])(\d{8})\b/,
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "You are not authorized. Please login.",
  FORBIDDEN: "You do not have permission to access this resource.",
  NOT_FOUND: "The requested resource was not found.",
  INTERNAL_SERVER_ERROR: "Something went wrong. Please try again later.",
  VALIDATION_ERROR: "Please check your input and try again.",
} as const;

export const ROLES = {
  USER: "ROLE_USER",
  ADMIN: "ROLE_ADMIN",
} as const;

export const APP_INFO = {
  NAME: "Dino Quiz",
  DESCRIPTION:
    "Embark on a prehistoric learning journey! Master knowledge through evolution-inspired quizzes and challenges.",
  LOGO_ALT: "Dino Quiz Logo",
  COPYRIGHT_YEAR: 2025,
} as const;

export const CONTACT_INFO = {
  EMAIL: "contact@example.com",
  PHONE: "+84 123 456 789",
  PHONE_DISPLAY: "+84 123 456 789",
  ADDRESS: "Your Address Here",
  GOOGLE_MAPS_URL: "https://maps.google.com/",
} as const;

export const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Quizzes", path: "/quizzes" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
] as const;

export const SOCIAL_LINKS = {
  TIKTOK: "#",
  FACEBOOK: "#",
  YOUTUBE: "#",
  LINKEDIN: "#",
} as const;
