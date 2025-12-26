import FeaturedQuizzes from "@/components/home/quiz-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const QuizPage = () => {
  return (
    <>
      <section className="container-custom pt-12">
        <div className="mx-auto text-center space-y-6">
          <h1 className="text-3xl font-bold">Take a Quiz</h1>

          <form className="flex flex-col md:flex-row items-center w-full gap-2 md:gap-0">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Enter quiz code to take a quiz"
                className="h-10 text-base shadow-sm md:rounded-r-none"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="h-10 px-8 w-full md:w-auto font-bold md:rounded-l-none cursor-pointer"
            >
              Take Quiz
            </Button>
          </form>
        </div>
      </section>
      <FeaturedQuizzes />
    </>
  );
};

export default QuizPage;
