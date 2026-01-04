import { z } from "zod";

export const quizSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title must be less than 150 characters"),

  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),

  durationMinutes: z
    .number()
    .int("Duration must be an integer")
    .min(1, "Duration must be at least 1 minute"),

  active: z.boolean(),
});

export type QuizFormData = z.infer<typeof quizSchema>;
