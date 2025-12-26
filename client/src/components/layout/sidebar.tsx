import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  FaUsers,
  FaClipboardList,
  FaQuestionCircle,
  FaUserShield,
} from "react-icons/fa";

const MENU_ITEMS = [
  {
    label: "Quiz Management",
    path: "/admin/quizzes",
    icon: FaClipboardList,
  },
  {
    label: "Question Management",
    path: "/admin/questions",
    icon: FaQuestionCircle,
  },
  {
    label: "User Management",
    path: "/admin/users",
    icon: FaUsers,
  },
  {
    label: "Role Management",
    path: "/admin/roles",
    icon: FaUserShield,
  },
];

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden w-64 flex-col border-r bg-card md:flex">
      <div className="flex h-16 items-center border-b px-3">
        <Link to="/">
          <span className="text-xl font-bold">Menu</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="flex flex-col gap-1 px-2">
          {MENU_ITEMS.map((item, index) => {
            const isActive = location.pathname.startsWith(item.path);

            return (
              <Link
                key={index}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;
