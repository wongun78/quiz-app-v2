import axiosInstance from "@/config/axios.config";
import type {
  ApiResponse,
  PageResponse,
  QuestionResponse,
  QuestionRequest,
  PaginationParams,
} from "@/types/backend";
import { API_ENDPOINTS } from "@/config/constants";

class QuestionService {
  async getAll(
    params?: PaginationParams
  ): Promise<PageResponse<QuestionResponse>> {
    const response = await axiosInstance.get<
      ApiResponse<PageResponse<QuestionResponse>>
    >(API_ENDPOINTS.QUESTIONS.BASE, { params });
    return response.data!;
  }

  async search(
    content?: string,
    type?: string,
    params?: PaginationParams
  ): Promise<PageResponse<QuestionResponse>> {
    const response = await axiosInstance.get<
      ApiResponse<PageResponse<QuestionResponse>>
    >(API_ENDPOINTS.QUESTIONS.SEARCH, {
      params: { content, type, ...params },
    });
    return response.data!;
  }

  async getById(id: string): Promise<QuestionResponse> {
    const response = await axiosInstance.get<ApiResponse<QuestionResponse>>(
      API_ENDPOINTS.QUESTIONS.BY_ID(id)
    );
    return response.data!;
  }

  async create(data: QuestionRequest): Promise<QuestionResponse> {
    const response = await axiosInstance.post<ApiResponse<QuestionResponse>>(
      API_ENDPOINTS.QUESTIONS.BASE,
      data
    );
    return response.data!;
  }

  async update(id: string, data: QuestionRequest): Promise<QuestionResponse> {
    const response = await axiosInstance.put<ApiResponse<QuestionResponse>>(
      API_ENDPOINTS.QUESTIONS.BY_ID(id),
      data
    );
    return response.data!;
  }

  async delete(id: string): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.QUESTIONS.BY_ID(id));
  }
}

export const questionService = new QuestionService();
