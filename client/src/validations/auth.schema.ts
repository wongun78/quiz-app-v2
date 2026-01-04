import { z } from "zod";
import { VALIDATION } from "@/config/constants";

export const loginSchema = z.object({
  email: z.email("Invalid email format").trim(),

  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must be less than 50 characters")
      .trim(),

    lastName: z
      .string()
      .min(1, "Last name is required")
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must be less than 50 characters")
      .trim(),

    email: z.email("Invalid email format").trim(),

    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username must be less than 50 characters")
      .regex(
        /^\w+$/,
        "Username can only contain letters, numbers, and underscores"
      )
      .trim(),

    password: z
      .string()
      .min(1, "Password is required")
      .min(
        VALIDATION.PASSWORD_MIN_LENGTH,
        `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`
      )
      .refine((val) => VALIDATION.PASSWORD_REGEX.test(val), {
        message:
          "Password must contain uppercase, lowercase, number and special character",
      }),

    confirmPassword: z.string().min(1, "Please confirm your password"),

    dateOfBirth: z.string().optional(),

    phoneNumber: z
      .string()
      .max(20, "Phone number must be less than 20 characters")
      .refine((val) => !val || VALIDATION.PHONE_REGEX.test(val), {
        message: "Invalid phone number format",
      })
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
