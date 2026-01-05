import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardWrap,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts";
import { quizService, examService } from "@/services";
import { ROUTES } from "@/config/constants";
import { confirmDialog } from "@/components/shared/ConfirmDialog";
import type { QuestionResponse, ExamSubmissionRequest } from "@/types/backend";

interface SelectedAnswers {
  [questionId: string]: string[];
}

const ExamPage = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: quiz,
    isLoading: quizLoading,
    error: quizError,
  } = useQuery({
    queryKey: ["quiz-exam", quizId],
    queryFn: async () => {
      if (!quizId) throw new Error("Quiz ID is required");
      const response = await quizService.getById(quizId);
      return response;
    },
    enabled: !!quizId && isAuthenticated,
    staleTime: 0,
    gcTime: 0,
  });

  const submitMutation = useMutation({
    mutationFn: (data: ExamSubmissionRequest) => examService.submit(data),
    onSuccess: (result) => {
      toast.success(
        result.passed ? "Congratulations! You passed!" : "Exam completed"
      );
      navigate(ROUTES.EXAM_RESULT(result.submissionId), { state: { result } });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to submit exam";
      toast.error(message);
      setIsSubmitting(false);
    },
  });

  const handleAnswerSelect = (
    questionId: string,
    answerId: string,
    questionType: "SINGLE_CHOICE" | "MULTIPLE_CHOICE"
  ) => {
    setSelectedAnswers((prev) => {
      if (questionType === "SINGLE_CHOICE") {
        return { ...prev, [questionId]: [answerId] };
      } else {
        const current = prev[questionId] || [];
        if (current.includes(answerId)) {
          return {
            ...prev,
            [questionId]: current.filter((id) => id !== answerId),
          };
        } else {
          return { ...prev, [questionId]: [...current, answerId] };
        }
      }
    });
  };

  const handleSubmitExam = async (autoSubmit = false) => {
    if (!quiz || !user || isSubmitting) return;

    if (!autoSubmit) {
      const confirmed = await confirmDialog({
        title: "Submit Exam",
        description:
          "Are you sure you want to submit your exam? You cannot change your answers after submission.",
        confirmText: "Submit",
        cancelText: "Cancel",
        variant: "default",
      });

      if (!confirmed) return;
    }

    setIsSubmitting(true);

    const answers = quiz.questions.map((q) => ({
      questionId: q.id,
      answerIds: selectedAnswers[q.id] || [],
    }));

    const submission: ExamSubmissionRequest = {
      userId: user.id,
      quizId: quiz.id,
      answers,
    };

    submitMutation.mutate(submission);
  };

  const handlePrevQuestion = () => {
    setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextQuestion = () => {
    if (quiz) {
      setCurrentQuestionIndex((prev) =>
        Math.min(quiz.questions.length - 1, prev + 1)
      );
    }
  };

  const handleQuestionSelect = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("Please login to take the exam");
      navigate(ROUTES.LOGIN, { state: { returnUrl: `/exam/${quizId}` } });
    }
  }, [authLoading, isAuthenticated, navigate, quizId]);

  if (authLoading || quizLoading) {
    return (
      <div className="container-custom py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  if (quizError || !quiz) {
    return (
      <section className="container-custom py-12">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h1 className="text-3xl font-bold text-destructive">
            Quiz Not Found
          </h1>
          <p className="text-muted-foreground text-lg">
            The quiz you're looking for doesn't exist or is not available.
          </p>
          <Button
            onClick={() => navigate(ROUTES.QUIZZES)}
            size="lg"
            className="cursor-pointer"
          >
            Back to Quizzes
          </Button>
        </div>
      </section>
    );
  }

  if (!quiz.active) {
    return (
      <section className="container-custom py-12">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h1 className="text-3xl font-bold text-destructive">
            Quiz Not Available
          </h1>
          <p className="text-muted-foreground text-lg">
            This quiz is currently inactive and cannot be taken.
          </p>
          <Button
            onClick={() => navigate(ROUTES.QUIZZES)}
            size="lg"
            className="cursor-pointer"
          >
            Back to Quizzes
          </Button>
        </div>
      </section>
    );
  }

  if (!quiz.questions || quiz.questions.length === 0) {
    return (
      <section className="container-custom py-12">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h1 className="text-3xl font-bold text-destructive">No Questions</h1>
          <p className="text-muted-foreground text-lg">
            This quiz doesn't have any questions yet.
          </p>
          <Button
            onClick={() => navigate(ROUTES.QUIZZES)}
            size="lg"
            className="cursor-pointer"
          >
            Back to Quizzes
          </Button>
        </div>
      </section>
    );
  }

  const currentQuestion: QuestionResponse =
    quiz.questions[currentQuestionIndex];

  return (
    <section className="container-custom py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-3">{quiz.title}</h1>
          {quiz.description && (
            <p className="text-muted-foreground text-lg mb-4">
              {quiz.description}
            </p>
          )}
          <Badge variant="secondary" className="text-sm px-4 py-1.5">
            Duration: {quiz.durationMinutes} minutes
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question navigation sidebar */}
          <div className="lg:col-span-1">
            <CardWrap>
              <CardHeader>
                <CardTitle className="text-base">Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
                  {quiz.questions.map((q, index) => {
                    const isAnswered = selectedAnswers[q.id]?.length > 0;
                    const isCurrent = index === currentQuestionIndex;
                    return (
                      <button
                        key={q.id}
                        onClick={() => handleQuestionSelect(index)}
                        className={`
                          w-10 h-10 rounded-lg text-sm font-medium transition-all
                          ${isCurrent ? "ring-2 ring-primary" : ""}
                          ${
                            isAnswered
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted hover:bg-muted/80"
                          }
                        `}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </CardWrap>
          </div>

          {/* Question content */}
          <div className="lg:col-span-3">
            <CardWrap>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardDescription>
                      Question {currentQuestionIndex + 1} of{" "}
                      {quiz.questions.length}
                    </CardDescription>
                    <CardTitle className="text-xl mt-2">
                      {currentQuestion.content}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        currentQuestion.type === "SINGLE_CHOICE"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {currentQuestion.type === "SINGLE_CHOICE"
                        ? "Single Choice"
                        : "Multiple Choice"}
                    </Badge>
                    <Badge variant="outline">{currentQuestion.score} pts</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {currentQuestion.answers.map((answer) => {
                  const isSelected = selectedAnswers[
                    currentQuestion.id
                  ]?.includes(answer.id);
                  return (
                    <label
                      key={answer.id}
                      htmlFor={answer.id}
                      className={`
                        flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all
                        ${
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-muted hover:border-primary/50"
                        }
                      `}
                    >
                      <Checkbox
                        id={answer.id}
                        checked={isSelected}
                        onCheckedChange={() =>
                          handleAnswerSelect(
                            currentQuestion.id,
                            answer.id,
                            currentQuestion.type
                          )
                        }
                        className={
                          currentQuestion.type === "SINGLE_CHOICE"
                            ? "rounded-full"
                            : ""
                        }
                      />
                      <span className="flex-1 text-base">{answer.content}</span>
                    </label>
                  );
                })}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                  size="lg"
                  className="cursor-pointer"
                >
                  ← Previous
                </Button>
                <div className="flex gap-2">
                  {currentQuestionIndex === quiz.questions.length - 1 ? (
                    <Button
                      onClick={() => handleSubmitExam(false)}
                      disabled={isSubmitting || submitMutation.isPending}
                      size="lg"
                      className="cursor-pointer"
                    >
                      {isSubmitting || submitMutation.isPending
                        ? "Submitting..."
                        : "Submit Exam"}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNextQuestion}
                      size="lg"
                      className="cursor-pointer"
                    >
                      Next →
                    </Button>
                  )}
                </div>
              </CardFooter>
            </CardWrap>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExamPage;
