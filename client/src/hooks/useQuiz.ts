import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { quizService } from "@/services";
import type { QuizResponse, PageResponse } from "@/types/backend";
import { toast } from "react-toastify";

interface UseQuizzesOptions {
  title?: string;
  active?: boolean;
  page?: number;
  size?: number;
}

export const useQuizzes = (options: UseQuizzesOptions = {}) => {
  const { title, active, page = 0, size = 10 } = options;

  return useQuery({
    queryKey: ["quizzes", { title, active, page, size }],
    queryFn: async () => {
      try {
        const response: PageResponse<QuizResponse> =
          title !== undefined || active !== undefined
            ? await quizService.search({ title, active, page, size })
            : await quizService.getAll({ page, size });
        return response;
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message || "Failed to fetch quizzes";
        toast.error(errorMessage);
        throw err;
      }
    },
    staleTime: 3 * 60 * 1000,
  });
};

export const useQuiz = (id: string | undefined) => {
  return useQuery({
    queryKey: ["quiz", id],
    queryFn: async () => {
      if (!id) throw new Error("Quiz ID is required");

      try {
        const response = await quizService.getById(id);
        return response;
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message || "Failed to fetch quiz";
        toast.error(errorMessage);
        throw err;
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => quizService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      toast.success("Quiz created successfully!");
    },
    onError: (err: any) => {
      const errorMessage =
        err?.response?.data?.message || "Failed to create quiz";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      quizService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      queryClient.invalidateQueries({ queryKey: ["quiz", variables.id] });
      toast.success("Quiz updated successfully!");
    },
    onError: (err: any) => {
      const errorMessage =
        err?.response?.data?.message || "Failed to update quiz";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => quizService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      toast.success("Quiz deleted successfully!");
    },
    onError: (err: any) => {
      const errorMessage =
        err?.response?.data?.message || "Failed to delete quiz";
      toast.error(errorMessage);
    },
  });
};
