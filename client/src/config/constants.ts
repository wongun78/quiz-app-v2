export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    REGISTER: "/api/v1/auth/register",
    LOGOUT: "/api/v1/auth/logout",
    REFRESH: "/api/v1/auth/refresh",
  },

  // Quizzes
  QUIZZES: {
    BASE: "/api/v1/quizzes",
    DETAIL: (id: string) => `/api/v1/quizzes/${id}`,
    SEARCH: "/api/v1/quizzes/search",
  },

  // Questions
  QUESTIONS: {
    BASE: "/api/v1/questions",
    DETAIL: (id: string) => `/api/v1/questions/${id}`,
    SEARCH: "/api/v1/questions/search",
  },

  // Users
  USERS: {
    BASE: "/api/v1/users",
    DETAIL: (id: string) => `/api/v1/users/${id}`,
    SEARCH: "/api/v1/users/search",
    BY_EMAIL: (email: string) => `/api/v1/users/email/${email}`,
  },

  // Roles
  ROLES: {
    BASE: "/api/v1/roles",
    DETAIL: (id: string) => `/api/v1/roles/${id}`,
  },

  // Exam
  EXAM: {
    SUBMIT: "/api/v1/exam/submit",
  },
} as const;

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

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token", //token
  REFRESH_TOKEN: "refresh_token",
  USER_INFO: "user_info",
  THEME: "theme",
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_SIZE: 10,
  DEFAULT_SORT: "createdAt,desc",
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
} as const;

export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
} as const;

export const UI = {
  TOAST_DURATION: 3000,
  DEBOUNCE_DELAY: 500,
  ANIMATION_DURATION: 300,
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

export const QUIZ_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export const QUESTION_TYPES = {
  SINGLE_CHOICE: "SINGLE_CHOICE",
  MULTIPLE_CHOICE: "MULTIPLE_CHOICE",
} as const;
