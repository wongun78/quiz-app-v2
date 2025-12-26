import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { Quiz } from "@/types/quiz";

interface QuizCardProps {
  quiz: Quiz;
}

const QuizCard = ({ quiz }: QuizCardProps) => {
  return (
    <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow cursor-pointer">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={quiz.image}
          alt={quiz.title}
          className="h-full w-full object-cover"
        />
      </div>

      <CardContent className="px-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-lg">{quiz.title}</h3>
          <h3 className="text-muted-foreground text-xs">{quiz.duration}</h3>
        </div>
        <p className="text-sm text-muted-foreground">{quiz.description}</p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link to={`/quiz/${quiz.id}`} className="w-full">
          <Button className="w-full cursor-pointer" size="lg">
            Start
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default QuizCard;
