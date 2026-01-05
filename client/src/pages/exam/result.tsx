import { useParams, Link, useLocation } from "react-router-dom";
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
import { ROUTES } from "@/config/constants";
import type { ExamResultResponse } from "@/types/backend";

const PassedBadge = () => (
  <Badge className="bg-primary text-primary-foreground text-lg px-6 py-2 font-bold">
    PASSED
  </Badge>
);

const FailedBadge = () => (
  <Badge variant="destructive" className="text-lg px-6 py-2 font-bold">
    FAILED
  </Badge>
);

const ExamResultPage = () => {
  const { submissionId } = useParams<{ submissionId: string }>();
  const location = useLocation();

  const result: ExamResultResponse | null = location.state?.result || null;

  if (!result) {
    return (
      <section className="container-custom py-12">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h1 className="text-3xl font-bold">Exam Result</h1>
          <p className="text-muted-foreground text-lg">
            Your submission has been recorded.
          </p>
          <p className="text-sm text-muted-foreground">
            Submission ID: <code className="text-xs">{submissionId}</code>
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="cursor-pointer"
            >
              <Link to={ROUTES.QUIZZES}>Browse Quizzes</Link>
            </Button>
            <Button asChild size="lg" className="cursor-pointer">
              <Link to={ROUTES.HOME}>Back to Home</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const displayResult = result;

  const scoreColorClass = displayResult.passed
    ? "text-primary"
    : "text-destructive";

  return (
    <section className="container-custom py-12">
      <div className="max-w-2xl mx-auto">
        <CardWrap className="text-center shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl font-bold">
              Exam Completed!
            </CardTitle>
            <CardDescription className="text-lg mt-3">
              {displayResult.passed
                ? "Congratulations! You have passed the exam."
                : "Unfortunately, you did not pass this time. Keep practicing!"}
            </CardDescription>
          </CardHeader>

          <CardContent className="py-8">
            <div className="grid grid-cols-2 gap-6 max-w-md mx-auto mb-8">
              <div className="text-center p-8 bg-muted/50 rounded-xl">
                <p className="text-sm text-muted-foreground mb-3 font-medium">
                  Your Score
                </p>
                <p className={`text-5xl font-bold ${scoreColorClass}`}>
                  {displayResult.score}
                </p>
              </div>
              <div className="text-center p-8 bg-muted/50 rounded-xl">
                <p className="text-sm text-muted-foreground mb-3 font-medium">
                  Total Questions
                </p>
                <p className="text-5xl font-bold text-foreground">
                  {displayResult.totalQuestions}
                </p>
              </div>
            </div>

            <div>
              {displayResult.passed ? <PassedBadge /> : <FailedBadge />}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="cursor-pointer"
            >
              <Link to={ROUTES.QUIZZES}>Browse More Quizzes</Link>
            </Button>
            <Button asChild size="lg" className="cursor-pointer">
              <Link to={ROUTES.HOME}>Back to Home</Link>
            </Button>
          </CardFooter>
        </CardWrap>
      </div>
    </section>
  );
};

export default ExamResultPage;
