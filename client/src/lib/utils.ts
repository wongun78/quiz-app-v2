import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper để extract error message từ API response
// Dùng thay cho `catch (error: any)` → `catch (error: unknown)`
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (
    error != null &&
    typeof error === "object" &&
    "response" in error &&
    error.response != null &&
    typeof error.response === "object" &&
    "data" in error.response &&
    error.response.data != null &&
    typeof error.response.data === "object" &&
    "message" in error.response.data &&
    typeof (error.response.data as { message?: unknown }).message === "string"
  ) {
    return (error.response.data as { message: string }).message;
  }
  return fallback;
}

// Gradient utilities for Dino theme
export const gradients = {
  section: "bg-gradient-to-br from-background via-secondary/10 to-primary/5",
  auth: "bg-gradient-to-br from-background via-secondary/20 to-primary/10",
  error404:
    "bg-gradient-to-br from-background via-destructive/5 to-destructive/10",
  error403: "bg-gradient-to-br from-background via-warning/5 to-warning/10",
  footer: "bg-gradient-to-br from-secondary/30 to-primary/5",
  card: "bg-gradient-to-t from-black/60 to-transparent",
  glow: "bg-gradient-to-br from-primary/20 to-success/20",
} as const;
