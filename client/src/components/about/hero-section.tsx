import { Link } from "react-router-dom";
import heroImage from "@/assets/images/hero.png";
import logoIcon from "@/assets/icons/logo.png";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";

const HeroSection = () => {
  return (
    <section className="py-12 bg-background">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex flex-col gap-4 items-start">
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-2 font-bold">
                <img src={logoIcon} alt="Quiz Logo" className="h-8 w-8" />
                <span className="text-xl font-bold text-foreground">
                  Quizzes
                </span>
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">
                The leading online quiz platform in Vietnam. Enhance your
                knowledge and develop critical thinking every day. For more
                information, please contact us through the following channels:
                Telephone, Email, and Address. Tell us what you need, we are
                always ready to support you! You can also visit our main website
                for more details.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-foreground">Contact</h3>
              <ul className="space-y-2 text-sm text-foreground/80">
                <li className="flex items-center gap-3">
                  <MdEmail className="text-xl text-primary" />
                  <a
                    href="mailto:kiennt169@fpt.com"
                    className="hover:text-primary transition-colors"
                  >
                    kiennt169@fpt.com
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <MdPhone className="text-xl text-primary" />
                  <a
                    href="tel:+84999888999"
                    className="hover:text-primary transition-colors"
                  >
                    +84 999 888 999
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MdLocationOn className="text-xl text-primary shrink-0" />
                  <a
                    href="https://maps.google.com/?q=123+Khuong+Dinh,+Thanh+Xuan,+Ha+Noi,+Viet+Nam"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    123 Khuong Dinh, Thanh Xuan, Ha Noi, Viet Nam
                  </a>
                </li>
              </ul>
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
