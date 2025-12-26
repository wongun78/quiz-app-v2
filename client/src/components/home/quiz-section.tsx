import QuizCard from "@/components/quiz/quiz-card";
import type { Quiz } from "@/types/quiz";

import quiz1Img from "@/assets/images/quizzes/quiz-1.png";
import quiz2Img from "@/assets/images/quizzes/quiz-2.png";
import quiz3Img from "@/assets/images/quizzes/quiz-3.png";

const featuredQuizzes: Quiz[] = [
  {
    id: "1",
    title: "Capitals of Country",
    description: "Test your knowledge about world capitals.",
    image: quiz1Img,
    duration: "15m",
    status: "active",
  },
  {
    id: "2",
    title: "Capitals of Country",
    description: "Test your knowledge about world capitals.",
    image: quiz2Img,
    duration: "15m",
    status: "active",
  },
  {
    id: "3",
    title: "Capitals of Country",
    description: "Test your knowledge about world capitals.",
    image: quiz3Img,
    duration: "15m",
    status: "active",
  },
];

const FeaturedQuizzes = () => {
  return (
    <section className="py-12">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-2">
            QUIZZES
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {featuredQuizzes.map((quiz) => (
            <div key={quiz.id} className="flex-1">
              <QuizCard quiz={quiz} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedQuizzes;
