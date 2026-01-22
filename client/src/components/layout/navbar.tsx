import { Link, NavLink } from "react-router-dom";
import { DinoFootprint } from "@/components/shared/DinoIcons";
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
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/contexts";
import { usePermission } from "@/hooks";
import { Authorize } from "@/components/auth";
import { APP_INFO, NAV_LINKS, ROUTES } from "@/config/constants";
import React from "react";

const getNavLinkClasses = (isActive: boolean) =>
  `text-sm font-semibold transition-colors cursor-pointer relative group ${
    isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
  }`;

const getUserInitials = (user: any) => {
  if (user?.fullName) {
    const names = user.fullName.split(" ");
    return names.length > 1
      ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
      : names[0].slice(0, 2).toUpperCase();
  }
  return user?.username?.slice(0, 2).toUpperCase() || "U";
};

const getUserAvatarUrl = (user: any) => {
  const seed = user?.username || user?.email || "default";
  return `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(
    seed,
  )}`;
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isAuthenticated } = usePermission();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-md shadow-sm">
      <div className="container-custom flex h-16 items-center justify-between">
        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-3 font-bold cursor-pointer group"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-md group-hover:bg-primary/30 transition-all"></div>
            <DinoFootprint size={36} className="relative text-primary" />
          </div>
          <span className="text-xl text-foreground group-hover:text-primary transition-colors">
            {APP_INFO.NAME}
          </span>
        </Link>

        <nav className="hidden gap-8 md:flex items-center">
          {NAV_LINKS.map((link, index) => (
            <React.Fragment key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) => getNavLinkClasses(isActive)}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </NavLink>

              {index === 1 && (
                <Authorize roles="ROLE_ADMIN">
                  <NavLink
                    to={ROUTES.ADMIN.QUIZZES}
                    className={({ isActive }) => getNavLinkClasses(isActive)}
                  >
                    Management
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                  </NavLink>
                </Authorize>
              )}
            </React.Fragment>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <div className="transition-all hover:rotate-12 hover:text-primary">
            <ThemeToggle variant="icon" />
          </div>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-primary/20 transition-all"
                >
                  <Avatar className="h-10 w-10 border-2 border-primary/20 cursor-pointer">
                    <AvatarImage
                      src={getUserAvatarUrl(user)}
                      alt={user?.fullName || user?.username || "User"}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {getUserInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex items-center gap-2 mb-1">
                    <DinoFootprint size={14} className="text-primary" />
                    <p className="text-sm font-semibold leading-none">
                      {user?.fullName || user?.username || "User"}
                    </p>
                  </div>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer hover:text-primary">
                  Change Password
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive cursor-pointer hover:bg-destructive/10"
                  onClick={handleLogout}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                to={ROUTES.LOGIN}
                className="text-sm font-semibold text-foreground hover:text-primary transition-colors cursor-pointer"
              >
                Login
              </Link>
              <Button asChild className="shadow-lg shadow-primary/30">
                <Link to={ROUTES.REGISTER}>Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
