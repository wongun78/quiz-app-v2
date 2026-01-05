import { Link } from "react-router-dom";
import logoIcon from "@/assets/icons/logo.png";
import { APP_INFO, NAV_LINKS, ROUTES } from "@/config/constants";
import ContactInfo from "@/components/shared/ContactInfo";

const Footer = () => {
  return (
    <footer className="w-full border-t bg-secondary/20 pt-8 pb-4">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row gap-12 mb-8">
          <div className="flex flex-col gap-4 flex-1">
            <Link
              to={ROUTES.HOME}
              className="flex items-center gap-2 font-bold"
            >
              <img src={logoIcon} alt={APP_INFO.LOGO_ALT} className="h-8 w-8" />
              <span className="text-xl font-bold text-foreground">
                {APP_INFO.NAME}
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              {APP_INFO.DESCRIPTION}
            </p>
          </div>

          <div className="flex flex-col gap-4 flex-1">
            <h3 className="font-bold text-foreground">Menu</h3>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="hover:text-primary transition-colors w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-4 flex-1">
            <h3 className="font-bold text-foreground">Contact</h3>
            <ContactInfo />
          </div>
        </div>

        <div className="border-t pt-4 text-center text-sm text-muted-foreground">
          <p>
            © {APP_INFO.COPYRIGHT_YEAR} {APP_INFO.NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
