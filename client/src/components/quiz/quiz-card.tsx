import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FernLeaf } from "@/components/shared/DinoIcons";
import type { QuizResponse } from "@/types/backend";
import type { MockQuiz } from "@/types/mock";

interface QuizCardProps {
  quiz: QuizResponse | MockQuiz;
}

const QuizCard = ({ quiz }: QuizCardProps) => {
  const imageSrc = (quiz as any).image;
  const duration = (quiz as any).duration || `${quiz.durationMinutes}m`;

  return (
    <Card className="group overflow-hidden border-2 border-border hover:border-primary/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer bg-card">
      <div className="relative h-48 w-full overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent z-10"></div>
        <img
          src={imageSrc}
          alt={quiz.title}
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 z-20">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/90 backdrop-blur-sm text-white text-xs font-semibold">
            <FernLeaf size={12} />
            {duration}
          </span>
        </div>
      </div>

      <CardContent className="p-5 space-y-3">
        <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {quiz.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {quiz.description}
        </p>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Link to={`/exam/${quiz.id}`} className="w-full">
          <Button
            className="w-full cursor-pointer shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
            size="lg"
          >
            Start Quiz
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default QuizCard;
