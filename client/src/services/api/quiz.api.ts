import axiosInstance from "@/config/axios.config";
import type {
  ApiResponse,
  PageResponse,
  QuizResponse,
  QuizDetailResponse,
  QuizRequest,
  PaginationParams,
  QuestionResponse,
} from "@/types/backend";
import { API_ENDPOINTS } from "@/config/constants";

class QuizService {
  async getAll(params?: PaginationParams): Promise<PageResponse<QuizResponse>> {
    const response = await axiosInstance.get<
      ApiResponse<PageResponse<QuizResponse>>
    >(API_ENDPOINTS.QUIZZES.BASE, { params });
    return response.data!;
  }

  async search(params: {
    title?: string;
    active?: boolean;
    page?: number;
    size?: number;
  }): Promise<PageResponse<QuizResponse>> {
    const response = await axiosInstance.get<
      ApiResponse<PageResponse<QuizResponse>>
    >(API_ENDPOINTS.QUIZZES.SEARCH, { params });
    return response.data!;
  }

  async getById(id: string): Promise<QuizDetailResponse> {
    const response = await axiosInstance.get<ApiResponse<QuizDetailResponse>>(
      API_ENDPOINTS.QUIZZES.DETAILS(id)
    );
    return response.data!;
  }

  async create(data: QuizRequest): Promise<QuizResponse> {
    const response = await axiosInstance.post<ApiResponse<QuizResponse>>(
      API_ENDPOINTS.QUIZZES.BASE,
      data
    );
    return response.data!;
  }

  async update(id: string, data: QuizRequest): Promise<QuizResponse> {
    const response = await axiosInstance.put<ApiResponse<QuizResponse>>(
      API_ENDPOINTS.QUIZZES.BY_ID(id),
      data
    );
    return response.data!;
  }

  async delete(id: string): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.QUIZZES.BY_ID(id));
  }

  async getQuestions(quizId: string): Promise<QuestionResponse[]> {
    const response = await axiosInstance.get<ApiResponse<QuestionResponse[]>>(
      API_ENDPOINTS.QUIZZES.QUESTIONS(quizId)
    );
    return response.data!;
  }

  async addQuestions(quizId: string, questionIds: string[]): Promise<void> {
    await axiosInstance.post(
      API_ENDPOINTS.QUIZZES.QUESTIONS(quizId),
      questionIds
    );
  }

  async removeQuestion(quizId: string, questionId: string): Promise<void> {
    await axiosInstance.delete(
      API_ENDPOINTS.QUIZZES.REMOVE_QUESTION(quizId, questionId)
    );
  }
}

export const quizService = new QuizService();
