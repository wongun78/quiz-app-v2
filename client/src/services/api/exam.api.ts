import axiosInstance from "@/config/axios.config";
import type {
  ApiResponse,
  ExamSubmissionRequest,
  ExamResultResponse,
} from "@/types/backend";

const EXAM_ENDPOINTS = {
  SUBMIT: "/exam/submit",
} as const;

class ExamService {
  async submit(data: ExamSubmissionRequest): Promise<ExamResultResponse> {
    const response = await axiosInstance.post<ApiResponse<ExamResultResponse>>(
      EXAM_ENDPOINTS.SUBMIT,
      data
    );
    return response.data!;
  }
}

export const examService = new ExamService();
