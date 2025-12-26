import { Link } from "react-router-dom";
import logoIcon from "@/assets/icons/logo.png";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="w-full border-t bg-secondary/20 pt-8 pb-4">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row gap-12 mb-8">
          <div className="flex flex-col gap-4 flex-1">
            <Link to="/" className="flex items-center gap-2 font-bold">
              <img src={logoIcon} alt="Quiz Logo" className="h-8 w-8" />
              <span className="text-xl font-bold text-foreground">Quizzes</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              The leading online quiz platform in Vietnam. Enhance your
              knowledge and develop critical thinking every day.
            </p>
          </div>

          <div className="flex flex-col gap-4 flex-1">
            <h3 className="font-bold text-foreground">Menu</h3>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link
                to="/"
                className="hover:text-primary transition-colors w-fit"
              >
                Home
              </Link>
              <Link
                to="/quizzes"
                className="hover:text-primary transition-colors w-fit"
              >
                Quizzes
              </Link>
              <Link
                to="/about"
                className="hover:text-primary transition-colors w-fit"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="hover:text-primary transition-colors w-fit"
              >
                Contact
              </Link>
            </nav>
          </div>

          <div className="flex flex-col gap-4 flex-1">
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

        <div className="border-t pt-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Quiz App. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
