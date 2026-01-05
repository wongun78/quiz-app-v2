import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import QuizCard from "@/components/quiz/quiz-card";

describe("QuizCard Component", () => {
  const mockQuiz = {
    id: "123e4567-e89b-12d3-a456-426614174000",
    title: "React Fundamentals Quiz",
    description: "Test your knowledge of React basics",
    durationMinutes: 30,
    active: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  };

  it("renders quiz title correctly", () => {
    render(
      <BrowserRouter>
        <QuizCard quiz={mockQuiz} />
      </BrowserRouter>
    );

    expect(screen.getByText("React Fundamentals Quiz")).toBeInTheDocument();
  });

  it("renders quiz description correctly", () => {
    render(
      <BrowserRouter>
        <QuizCard quiz={mockQuiz} />
      </BrowserRouter>
    );

    expect(
      screen.getByText("Test your knowledge of React basics")
    ).toBeInTheDocument();
  });

  it("displays duration information", () => {
    render(
      <BrowserRouter>
        <QuizCard quiz={mockQuiz} />
      </BrowserRouter>
    );

    expect(screen.getByText("30m")).toBeInTheDocument();
  });
});
