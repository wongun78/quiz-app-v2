/**
 * Mock Data Types
 * These types are used for placeholder/mock data in components
 * before full backend integration
 */

import type {
  QuizResponse,
  QuestionResponse,
  TeamMemberResponse,
} from "./backend";

// Extended Quiz type for mock data with UI-specific fields
export interface MockQuiz extends Partial<QuizResponse> {
  id: string;
  title: string;
  description: string;
  image?: string; // Local image path for mock data
  duration?: string; // UI-friendly duration string like "15m"
  durationMinutes?: number; // Backend duration in minutes
  status?: string; // UI status like "active"
  active?: boolean; // Backend active flag
}

// Extended Question type for mock data
export interface MockQuestion extends Partial<QuestionResponse> {
  id: number | string;
  content: string;
  type: string;
  answer?: any; // Mock field for single answer display
  answers?: number | any[]; // Can be count or array
  status?: string; // UI status string
  order?: number; // Question order in quiz
}

// Extended TeamMember for mock data
export interface MockTeamMember extends Partial<TeamMemberResponse> {
  id: string;
  name: string;
  role: string;
  image: string;
}

// Helper functions to safely access mock or real data
export function getQuizImage(
  quiz: QuizResponse | MockQuiz
): string | undefined {
  return (quiz as any).image; // Only mock data has image field
}

export function getQuizDuration(quiz: QuizResponse | MockQuiz): string {
  return (quiz as any).duration || `${quiz.durationMinutes}m`;
}

export function getQuizStatus(quiz: QuizResponse | MockQuiz): string {
  return (quiz as any).status || (quiz.active ? "active" : "inactive");
}

export function getQuestionAnswer(
  question: QuestionResponse | MockQuestion
): any {
  return (question as any).answer || question.answers;
}

export function getQuestionStatus(
  question: QuestionResponse | MockQuestion
): string {
  return (question as any).status || "Active"; // Default to Active for backend data
}
