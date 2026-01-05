import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { QuizResponse } from "@/types/backend";
import type { MockQuiz } from "@/types/mock";

interface QuizCardProps {
  quiz: QuizResponse | MockQuiz;
}

const QuizCard = ({ quiz }: QuizCardProps) => {
  const imageSrc = (quiz as any).image;
  const duration = (quiz as any).duration || `${quiz.durationMinutes}m`;

  return (
    <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow cursor-pointer">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={imageSrc}
          alt={quiz.title}
          className="h-full w-full object-cover"
        />
      </div>

      <CardContent className="px-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-lg">{quiz.title}</h3>
          <h3 className="text-muted-foreground text-xs">{duration}</h3>
        </div>
        <p className="text-sm text-muted-foreground">{quiz.description}</p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link to={`/exam/${quiz.id}`} className="w-full">
          <Button className="w-full cursor-pointer" size="lg">
            Start
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default QuizCard;
