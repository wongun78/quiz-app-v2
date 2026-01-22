import QuizCard from "@/components/quiz/quiz-card";
import { useQuizzes } from "@/hooks/useQuiz";
import { FernLeaf } from "@/components/shared/DinoIcons";
import { SectionHeading } from "@/components/shared/SectionHeading";

const quiz1Img =
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop&q=80";

const FeaturedQuizzes = () => {
  const { data, isLoading } = useQuizzes({ active: true, page: 0, size: 3 });

  const quizzes = data?.content || [];

  const quizzesWithImage = quizzes.map((quiz) => ({
    ...quiz,
    image: quiz1Img,
  }));

  if (isLoading) {
    return (
      <section className="py-20 bg-secondary/20">
        <div className="container-custom">
          <SectionHeading
            icon={<FernLeaf size={32} className="text-primary" />}
            title="Featured Quizzes"
            description="Discover your next learning adventure"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-secondary/20">
      <div className="container-custom">
        <SectionHeading
          icon={<FernLeaf size={32} className="text-primary" />}
          title="Featured Quizzes"
          description="Discover your next learning adventure"
        />

        {quizzesWithImage.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
              <FernLeaf size={40} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-lg">
              No quizzes available at the moment.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Check back soon for new challenges!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzesWithImage.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedQuizzes;
