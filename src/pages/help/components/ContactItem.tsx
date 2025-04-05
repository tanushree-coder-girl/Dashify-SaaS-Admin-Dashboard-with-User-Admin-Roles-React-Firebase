import { LucideIcon } from "lucide-react";

interface ContactItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

const ContactItem: React.FC<ContactItemProps> = ({
  icon: Icon,
  label,
  href,
}) => (
  <a
    href={href}
    className="flex items-center gap-4 p-4 text-theme rounded-2xl hover:bg-opacity-80 transition-all duration-300"
  >
    <Icon size={20} />
    <span>{label}</span>
  </a>
);

export default ContactItem;
