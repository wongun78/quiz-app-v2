import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FaTiktok, FaFacebook, FaYoutube, FaLinkedin } from "react-icons/fa";
import { SOCIAL_LINKS } from "@/config/constants";
import ContactInfo from "@/components/shared/ContactInfo";

const ContactPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="container-custom py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold uppercase">Contact</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-2">Feedback</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Please fill out the form below to send us your feedback. We will
              get back to you as soon as possible.
            </p>

            <form className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Enter your name" />
              </div>

              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>

              <div className="space-y-1">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Enter your message"
                  className="min-h-[120px]"
                />
              </div>

              <Button
                type="submit"
                className="w-full md:w-auto px-4 cursor-pointer"
              >
                Send
              </Button>
            </form>
          </div>

          <div className="flex flex-col gap-6 flex-1">
            <div>
              <h2 className="text-xl font-bold mb-2">Our Information</h2>
              <p className="text-muted-foreground text-sm">
                We are always here to help you. You can contact us through the
                following ways.
              </p>
            </div>

            <ContactInfo className="space-y-4" />

            <div className="flex items-center gap-4">
              <a
                href={SOCIAL_LINKS.TIKTOK}
                className="hover:text-primary transition-colors"
              >
                <FaTiktok className="text-2xl" />
              </a>
              <a
                href={SOCIAL_LINKS.FACEBOOK}
                className="hover:text-primary transition-colors"
              >
                <FaFacebook className="text-2xl" />
              </a>
              <a
                href={SOCIAL_LINKS.YOUTUBE}
                className="hover:text-primary transition-colors"
              >
                <FaYoutube className="text-2xl" />
              </a>
              <a
                href={SOCIAL_LINKS.LINKEDIN}
                className="hover:text-primary transition-colors"
              >
                <FaLinkedin className="text-2xl" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
