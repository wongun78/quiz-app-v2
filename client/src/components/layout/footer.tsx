import { Link } from "react-router-dom";
import { DinoFootprint } from "@/components/shared/DinoIcons";
import { APP_INFO, NAV_LINKS, ROUTES } from "@/config/constants";
import ContactInfo from "@/components/shared/ContactInfo";

const Footer = () => {
  return (
    <footer className="w-full border-t border-border/50 bg-linear-to-br from-secondary/30 to-primary/5 pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <div className="flex flex-col gap-6">
            <Link
              to={ROUTES.HOME}
              className="inline-flex items-center gap-3 font-bold group w-fit"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-md group-hover:bg-primary/30 transition-all"></div>
                <DinoFootprint size={40} className="relative text-primary" />
              </div>
              <span className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                {APP_INFO.NAME}
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              {APP_INFO.DESCRIPTION}
            </p>
          </div>

          {/* Menu Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-foreground text-lg">Quick Links</h3>
            </div>
            <nav className="flex flex-col gap-3 text-sm">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-muted-foreground hover:text-primary transition-colors w-fit flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-foreground text-lg">Contact Us</h3>
            </div>
            <ContactInfo />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {APP_INFO.COPYRIGHT_YEAR} {APP_INFO.NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
