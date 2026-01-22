import { Link } from "react-router-dom";
import { DinoFootprint } from "@/components/shared/DinoIcons";
import { APP_INFO, ROUTES } from "@/config/constants";
import ContactInfo from "@/components/shared/ContactInfo";

const heroImage =
  "https://images.unsplash.com/photo-1511497584788-876760111969?w=1200&h=800&fit=crop&q=80";

const HeroSection = () => {
  return (
    <section className="py-16 bg-linear-to-br from-background via-secondary/10 to-primary/5">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 flex flex-col gap-8">
            <div className="space-y-6">
              <Link
                to={ROUTES.HOME}
                className="inline-flex items-center gap-3 font-bold group"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-md group-hover:bg-primary/30 transition-all"></div>
                  <DinoFootprint size={48} className="relative text-primary" />
                </div>
                <span className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {APP_INFO.NAME}
                </span>
              </Link>

              <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
                {APP_INFO.DESCRIPTION} For more information, please contact us
                through the following channels. Tell us what you need, we are
                always ready to support you!
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <DinoFootprint size={24} className="text-primary" />
                <h3 className="font-bold text-foreground text-xl">
                  Get in Touch
                </h3>
              </div>
              <ContactInfo />
            </div>
          </div>

          <div className="flex-1 flex justify-center md:justify-end">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-success/20 rounded-2xl blur-2xl"></div>
              <img
                src={heroImage}
                alt="About us illustration"
                className="relative w-full max-w-[500px] h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
