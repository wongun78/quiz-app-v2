import { Link } from "react-router-dom";
import heroImage from "@/assets/images/hero.jpg";
import logoIcon from "@/assets/icons/logo.png";
import { APP_INFO, ROUTES } from "@/config/constants";
import ContactInfo from "@/components/shared/ContactInfo";

const HeroSection = () => {
  return (
    <section className="py-12 bg-background">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex flex-col gap-4 items-start">
            <div className="space-y-4">
              <Link
                to={ROUTES.HOME}
                className="flex items-center gap-2 font-bold"
              >
                <img
                  src={logoIcon}
                  alt={APP_INFO.LOGO_ALT}
                  className="h-8 w-8"
                />
                <span className="text-xl font-bold text-foreground">
                  {APP_INFO.NAME}
                </span>
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">
                {APP_INFO.DESCRIPTION} For more information, please contact us
                through the following channels: Telephone, Email, and Address.
                Tell us what you need, we are always ready to support you! You
                can also visit our main website for more details.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-foreground">Contact</h3>
              <ContactInfo />
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
