import { Link, NavLink } from "react-router-dom";
import logoIcon from "@/assets/icons/logo.png";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const isAuthenticated = true;
  // const isAuthenticated = false;

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="container-custom flex h-16 items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold cursor-pointer"
        >
          <img src={logoIcon} alt="Quiz Logo" className="h-8 w-8" />
          <span className="text-xl text-foreground">Quizzes</span>
        </Link>

        <nav className="hidden gap-6 md:flex items-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors cursor-pointer ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/quizzes"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors cursor-pointer ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`
            }
          >
            Quizzes
          </NavLink>

          {isAuthenticated && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`
              }
            >
              Management
            </NavLink>
          )}

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors cursor-pointer ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`
            }
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors cursor-pointer ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`
            }
          >
            Contact
          </NavLink>
        </nav>

        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors cursor-pointer"
              >
                Login
              </Link>
              <Button asChild>
                <Link to="/register">Register</Link>
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10 border p-1 cursor-pointer">
                    <AvatarImage
                      src="https://api.dicebear.com/9.x/avataaars/svg?seed=KienTrung"
                      alt="User"
                    />
                    <AvatarFallback>CD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <p className="text-sm font-medium leading-none">Kien Trung</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  Change Password
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive cursor-pointer">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
