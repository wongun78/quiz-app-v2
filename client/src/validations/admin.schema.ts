import { z } from "zod";
import { VALIDATION } from "@/config/constants";

export const userSchema = z.object({
  email: z.email({ error: "Invalid email format" }),

  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters"),

  password: z
    .string()
    .min(
      VALIDATION.PASSWORD_MIN_LENGTH,
      `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`
    )
    .refine((val) => VALIDATION.PASSWORD_REGEX.test(val), {
      message:
        "Password must contain uppercase, lowercase, number and special character",
    }),

  active: z.boolean().optional().default(true),

  roleIds: z.array(z.uuid({ error: "Invalid role ID format" })).optional(),
});

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

export type UserFormData = z.infer<typeof userSchema>;
export type RoleFormData = z.infer<typeof roleSchema>;
