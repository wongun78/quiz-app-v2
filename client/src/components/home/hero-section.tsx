import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/images/hero.png";

const HeroSection = () => {
  return (
    <section className="py-12 bg-background">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold md:text-4xl text-foreground">
              Welcome to Quiz App
            </h1>

            <p className="max-w-[600px] text-muted-foreground text-base md:text-lg">
              The leading online quiz platform. Challenge yourself with
              thousands of diverse questions and track your progress today. Join
              our community of quiz enthusiasts and start learning in a fun way!
            </p>

            <div className="mt-4">
              <Link to="/quizzes">
                <Button size="lg" className="cursor-pointer">
                  Take a Quiz
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <img
              src={heroImage}
              alt="Quiz illustration"
              className="w-[550px] h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
