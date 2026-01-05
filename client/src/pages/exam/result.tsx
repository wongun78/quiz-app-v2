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
  <Badge className="bg-green-600 text-white text-lg px-4 py-1">PASSED ✓</Badge>
);

const FailedBadge = () => (
  <Badge variant="destructive" className="text-lg px-4 py-1">
    FAILED ✗
  </Badge>
);

const ExamResultPage = () => {
  const { submissionId } = useParams<{ submissionId: string }>();
  const location = useLocation();

  const result: ExamResultResponse | null = location.state?.result || null;

  if (!result) {
    return (
      <div className="container-custom py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Exam Result</h1>
          <p className="text-muted-foreground mb-6">
            Your submission has been recorded.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Submission ID: <code className="text-xs">{submissionId}</code>
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild variant="outline">
              <Link to={ROUTES.QUIZZES}>Browse Quizzes</Link>
            </Button>
            <Button asChild>
              <Link to={ROUTES.HOME}>Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const displayResult = result;

  const scoreColorClass = displayResult.passed
    ? "text-green-600"
    : "text-red-600";

  return (
    <div className="container-custom py-12">
      <div className="max-w-2xl mx-auto">
        <CardWrap className="text-center">
          <CardHeader className="pb-2">
            <div className="mx-auto mb-4">
              {displayResult.passed ? (
                <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-5xl">🎉</span>
                </div>
              ) : (
                <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-5xl">😔</span>
                </div>
              )}
            </div>
            <CardTitle className="text-3xl">Exam Completed!</CardTitle>
            <CardDescription className="text-lg mt-2">
              {displayResult.passed
                ? "Congratulations! You have passed the exam."
                : "Unfortunately, you did not pass this time. Keep practicing!"}
            </CardDescription>
          </CardHeader>

          <CardContent className="py-8">
            <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
              <div className="text-center p-6 bg-muted rounded-xl">
                <p className="text-sm text-muted-foreground mb-2">Your Score</p>
                <p className={`text-4xl font-bold ${scoreColorClass}`}>
                  {displayResult.score}
                </p>
              </div>
              <div className="text-center p-6 bg-muted rounded-xl">
                <p className="text-sm text-muted-foreground mb-2">
                  Total Questions
                </p>
                <p className="text-4xl font-bold">
                  {displayResult.totalQuestions}
                </p>
              </div>
            </div>

            <div className="mt-8">
              {displayResult.passed ? <PassedBadge /> : <FailedBadge />}
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Submission ID: <code className="text-xs">{submissionId}</code>
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button asChild variant="outline" size="lg">
              <Link to={ROUTES.QUIZZES}>Browse More Quizzes</Link>
            </Button>
            <Button asChild size="lg">
              <Link to={ROUTES.HOME}>Back to Home</Link>
            </Button>
          </CardFooter>
        </CardWrap>
      </div>
    </div>
  );
};

export default ExamResultPage;
