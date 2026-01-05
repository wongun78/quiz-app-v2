import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FeaturedQuizzes from "@/components/home/quiz-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuiz } from "@/hooks";
import { ROUTES } from "@/config/constants";
import { toast } from "react-toastify";

const QuizPage = () => {
  const [quizId, setQuizId] = useState("");
  const [attemptedId, setAttemptedId] = useState<string | undefined>();
  const navigate = useNavigate();

  const { data: quiz, isLoading } = useQuiz(attemptedId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedId = quizId.trim();

    if (!trimmedId) {
      toast.error("Please enter a quiz ID");
      return;
    }

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(trimmedId)) {
      toast.error("Invalid quiz ID format. Please enter a valid UUID.");
      return;
    }

    setAttemptedId(trimmedId);
  };

  useEffect(() => {
    if (quiz && attemptedId) {
      if (quiz.active) {
        navigate(ROUTES.TAKE_EXAM(attemptedId));
      } else {
        toast.error("This quiz is not currently available");
        setAttemptedId(undefined);
        setQuizId("");
      }
    }
  }, [quiz, attemptedId, navigate]);

  return (
    <>
      <section className="container-custom pt-12">
        <div className="mx-auto text-center space-y-6">
          <h1 className="text-3xl font-bold">Take a Quiz</h1>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row items-center w-full gap-2 md:gap-0"
          >
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Enter quiz ID to take a quiz"
                className="h-10 text-base shadow-sm md:rounded-r-none"
                value={quizId}
                onChange={(e) => setQuizId(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="h-10 px-8 w-full md:w-auto font-bold md:rounded-l-none cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Checking..." : "Take Quiz"}
            </Button>
          </form>
        </div>
      </section>
      <FeaturedQuizzes />
    </>
  );
};

export default QuizPage;
