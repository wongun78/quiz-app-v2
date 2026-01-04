import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
import { CONTACT_INFO } from "@/config/constants";

interface ContactInfoProps {
  className?: string;
}

const ContactInfo = ({ className = "" }: ContactInfoProps) => {
  return (
    <ul className={`space-y-2 text-sm text-foreground/80 ${className}`}>
      <li className="flex items-center gap-3">
        <MdEmail className="text-xl text-primary" />
        <a
          href={`mailto:${CONTACT_INFO.EMAIL}`}
          className="hover:text-primary transition-colors"
        >
          {CONTACT_INFO.EMAIL}
        </a>
      </li>
      <li className="flex items-center gap-3">
        <MdPhone className="text-xl text-primary" />
        <a
          href={`tel:${CONTACT_INFO.PHONE.replaceAll(" ", "")}`}
          className="hover:text-primary transition-colors"
        >
          {CONTACT_INFO.PHONE_DISPLAY}
        </a>
      </li>
      <li className="flex items-start gap-3">
        <MdLocationOn className="text-xl text-primary shrink-0" />
        <a
          href={CONTACT_INFO.GOOGLE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
        >
          {CONTACT_INFO.ADDRESS}
        </a>
      </li>
    </ul>
  );
};

export default ContactInfo;
