export interface ApiResponse<T = any> {
  timestamp: string;
  status: number;
  message: string;
  data?: T;
  errors?: Record<string, string> | string[];
  path: string;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  hasContent: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  dateOfBirth?: string;
  phoneNumber?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: UserResponse;
  roles: string[];
}

export interface UserResponse {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  active: boolean;
  roles: string[]; // RoleEnum values
}

export interface UserRequest {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  active?: boolean;
  roleIds?: string[];
}

export interface UserUpdateRequest {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password?: string; // Optional for update
  dateOfBirth?: string;
  phoneNumber?: string;
  active?: boolean;
  roleIds?: string[];
}

export interface RoleResponse {
  id: string;
  name: string; // RoleEnum: "ROLE_ADMIN" | "ROLE_USER"
  description?: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface RoleRequest {
  name: string; // RoleEnum: "ROLE_ADMIN" | "ROLE_USER"
  description?: string;
}
// Basic quiz info (list view)
export interface QuizResponse {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  active: boolean;
  totalQuestions: number;
}

// Detailed quiz with questions (detail view)
export interface QuizDetailResponse {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  active: boolean;
  questions: QuestionResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface QuizRequest {
  title: string;
  description: string;
  durationMinutes: number;
  active?: boolean;
}

export type QuestionType = "SINGLE_CHOICE" | "MULTIPLE_CHOICE";

export interface QuestionResponse {
  id: string;
  content: string;
  type: QuestionType;
  score: number;
  quizzes: {
    id: string;
    title: string;
  }[];
  answers: AnswerResponse[];
}

export interface QuestionRequest {
  content: string;
  type: QuestionType;
  score: number;
  answers: AnswerRequest[];
}

export interface AnswerResponse {
  id: string;
  content: string;
  isCorrect: boolean;
}

export interface AnswerRequest {
  id?: string; // Optional, only for update
  content: string;
  isCorrect: boolean;
}

export interface ExamSubmissionRequest {
  userId: string;
  quizId: string;
  answers: {
    questionId: string;
    answerIds: string[];
  }[];
}

export interface ExamResultResponse {
  submissionId: string;
  totalQuestions: number;
  score: number;
  passed: boolean;
}

export interface SearchParams {
  query?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  eullword: string;
  confirmPassword: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

// Team member type (for About page - not backend API)
export interface TeamMemberResponse {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  github?: string;
  linkedin?: string;
}
mail: string;
pass;

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface AuthState {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type AsyncResult<T> = Promise<T>;
