import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { questionService } from "@/services";
import type { QuestionResponse, PageResponse } from "@/types/backend";
import { toast } from "react-toastify";

interface UseQuestionsOptions {
  content?: string;
  type?: string;
  page?: number;
  size?: number;
}

export const useQuestions = (options: UseQuestionsOptions = {}) => {
  const { content, type, page = 0, size = 10 } = options;

  return useQuery({
    queryKey: ["questions", { content, type, page, size }],
    queryFn: async () => {
      try {
        let response: PageResponse<QuestionResponse>;

        if (content !== undefined || type !== undefined) {
          response = await questionService.search(content, type, {
            page,
            size,
          });
        } else {
          response = await questionService.getAll({ page, size });
        }

        return response;
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message || "Failed to fetch questions";
        toast.error(errorMessage);
        throw err;
      }
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useQuestion = (id: string | undefined) => {
  return useQuery({
    queryKey: ["question", id],
    queryFn: async () => {
      if (!id) throw new Error("Question ID is required");

      try {
        const response = await questionService.getById(id);
        return response;
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message || "Failed to fetch question";
        toast.error(errorMessage);
        throw err;
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => questionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      toast.success("Question created successfully!");
    },
    onError: (err: any) => {
      const errorMessage =
        err?.response?.data?.message || "Failed to create question";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      questionService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      queryClient.invalidateQueries({ queryKey: ["question", variables.id] });
      toast.success("Question updated successfully!");
    },
    onError: (err: any) => {
      const errorMessage =
        err?.response?.data?.message || "Failed to update question";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => questionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      toast.success("Question deleted successfully!");
    },
    onError: (err: any) => {
      const errorMessage =
        err?.response?.data?.message || "Failed to delete question";
      toast.error(errorMessage);
    },
  });
};
