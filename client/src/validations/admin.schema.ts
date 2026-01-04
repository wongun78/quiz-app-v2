import { z } from "zod";
import { VALIDATION } from "@/config/constants";

export const userSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name must be less than 50 characters"),

    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name must be less than 50 characters"),

    email: z.string().min(1, "Email is required").email("Invalid email format"),

    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username must be less than 50 characters")
      .regex(
        /^\w+$/,
        "Username can only contain letters, numbers, and underscores"
      ),

    password: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= VALIDATION.PASSWORD_MIN_LENGTH, {
        message: `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`,
      })
      .refine((val) => !val || VALIDATION.PASSWORD_REGEX.test(val), {
        message:
          "Password must contain uppercase, lowercase, number and special character",
      }),

    confirmPassword: z.string().optional(),

    dateOfBirth: z.string().optional(),

    phoneNumber: z
      .string()
      .max(20, "Phone number must be less than 20 characters")
      .optional(),

    active: z.boolean().default(true),

    roleIds: z.array(z.string()).optional().default([]),
  })
  .refine(
    (data) => {
      if (data.password) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export const roleSchema = z.object({
  name: z
    .string()
    .min(1, "Role name is required")
    .max(50, "Role name must be less than 50 characters")
    .regex(
      /^ROLE_[A-Z_]+$/,
      "Role name must start with 'ROLE_' and contain only uppercase letters and underscores"
    ),

  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .optional(),

  isActive: z.boolean().optional(),
});

export const answerSchema = z.object({
  id: z.string().optional(),
  content: z.string().min(1, "Answer content is required"),
  isCorrect: z.boolean().default(false),
  active: z.boolean().default(true),
});

export const questionSchema = z.object({
  content: z.string().min(1, "Question content is required"),

  type: z.enum(["SINGLE_CHOICE", "MULTIPLE_CHOICE"], {
    message: "Question type is required",
  }),

  score: z.number().min(1, "Score must be at least 1").default(10),

  active: z.boolean().default(true),
});

export type UserFormData = z.infer<typeof userSchema>;
export type RoleFormData = z.infer<typeof roleSchema>;
export type QuestionFormData = z.infer<typeof questionSchema>;
export type AnswerFormData = z.infer<typeof answerSchema>;
