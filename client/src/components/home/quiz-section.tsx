import QuizCard from "@/components/quiz/quiz-card";
import { useQuizzes } from "@/hooks/useQuiz";
import quiz1Img from "@/assets/images/quizzes/quiz-1.jpg";

const FeaturedQuizzes = () => {
  const { data, isLoading } = useQuizzes({ active: true, page: 0, size: 3 });

  const quizzes = data?.content || [];

  const quizzesWithImage = quizzes.map((quiz) => ({
    ...quiz,
    image: quiz1Img,
  }));

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-2">
              QUIZZES
            </h2>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex-1 h-96 bg-muted animate-pulse rounded-lg"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-2">
            QUIZZES
          </h2>
        </div>

        {quizzesWithImage.length === 0 ? (
          <div className="text-center text-muted-foreground">
            No quizzes available at the moment.
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4">
            {quizzesWithImage.map((quiz) => (
              <div key={quiz.id} className="flex-1">
                <QuizCard quiz={quiz} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedQuizzes;
