import type { QuizResponse, QuestionResponse } from "./backend";

export type { MockQuiz, MockQuestion, MockTeamMember } from "./mock.d";

import type { MockQuiz, MockQuestion } from "./mock.d";

export function getQuizImage(
  quiz: QuizResponse | MockQuiz
): string | undefined {
  return (quiz as any).image;
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
  return (question as any).status || "Active";
}
