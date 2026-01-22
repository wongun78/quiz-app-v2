import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DinoFootprint, FernLeaf } from "@/components/shared/DinoIcons";

const heroImage =
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop&q=80";

const HeroSection = () => {
  return (
    <section className="relative py-20 bg-linear-to-br from-background via-secondary/10 to-primary/5 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 opacity-5">
        <DinoFootprint size={200} />
      </div>
      <div className="absolute bottom-10 left-10 opacity-5">
        <FernLeaf size={150} />
      </div>

      <div className="container-custom relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <DinoFootprint size={20} className="text-primary" />
              <span className="text-sm font-medium text-primary">
                Prehistoric Knowledge Platform
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Welcome to{" "}
              <span className="text-primary block mt-2">Dino Quiz</span>
            </h1>

            <p className="max-w-[600px] text-muted-foreground text-lg md:text-xl leading-relaxed">
              🦕 Embark on a learning adventure through time. Challenge yourself
              with diverse questions, track your evolution, and join our
              community of knowledge seekers!
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <Link to="/quizzes">
                <Button
                  size="lg"
                  className="cursor-pointer shadow-lg shadow-primary/30 hover:-translate-y-0.5 transition-all"
                >
                  <FernLeaf size={20} />
                  Explore Quizzes
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="cursor-pointer">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex-1 flex justify-center md:justify-end">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-success/20 rounded-2xl blur-2xl"></div>
              <img
                src={heroImage}
                alt="Quiz illustration"
                className="relative w-full max-w-[550px] h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
