import { describe, it, expect } from "vitest";
import { ROUTES, API_ENDPOINTS, APP_INFO } from "@/config/constants";

describe("Constants", () => {
  describe("ROUTES", () => {
    it("should have correct route paths", () => {
      expect(ROUTES.HOME).toBe("/");
      expect(ROUTES.LOGIN).toBe("/login");
      expect(ROUTES.REGISTER).toBe("/register");
      expect(ROUTES.QUIZZES).toBe("/quizzes");
    });

    it("should have admin routes", () => {
      expect(ROUTES.ADMIN.DASHBOARD).toBe("/admin");
      expect(ROUTES.ADMIN.QUIZZES).toBe("/admin/quizzes");
      expect(ROUTES.ADMIN.QUESTIONS).toBe("/admin/questions");
      expect(ROUTES.ADMIN.USERS).toBe("/admin/users");
    });
  });

  describe("API_ENDPOINTS", () => {
    it("should have correct API endpoints", () => {
      expect(API_ENDPOINTS.AUTH.LOGIN).toBe("/auth/login");
      expect(API_ENDPOINTS.AUTH.REGISTER).toBe("/auth/register");
      expect(API_ENDPOINTS.QUIZZES.BASE).toBe("/quizzes");
      expect(API_ENDPOINTS.QUESTIONS.BASE).toBe("/questions");
    });
  });

  describe("APP_INFO", () => {
    it("should have application information", () => {
      expect(APP_INFO.NAME).toBe("Quizzes");
      expect(APP_INFO.DESCRIPTION).toBeTruthy();
      expect(APP_INFO.COPYRIGHT_YEAR).toBe(2025);
    });
  });
});
