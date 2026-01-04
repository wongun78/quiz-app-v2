import type {
  QuizResponse,
  QuestionResponse,
  TeamMemberResponse,
} from "./backend";

export interface MockQuiz extends Partial<QuizResponse> {
  id: string;
  title: string;
  description: string;
  image?: string;
  duration?: string;
  durationMinutes?: number;
  status?: string;
  active?: boolean;
}

export interface MockQuestion extends Partial<QuestionResponse> {
  id: number | string;
  content: string;
  type: string;
  answer?: any;
  answers?: number | any[];
  status?: string;
  order?: number;
}

export interface MockTeamMember extends Partial<TeamMemberResponse> {
  id: string;
  name: string;
  role: string;
  image: string;
}

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
