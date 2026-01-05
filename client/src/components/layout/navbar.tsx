import { Link, NavLink } from "react-router-dom";
import React from "react";
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
import { useAuth } from "@/contexts";
import { usePermission } from "@/hooks";
import { Authorize } from "@/components/auth";
import { APP_INFO, NAV_LINKS, ROUTES } from "@/config/constants";

const getNavLinkClasses = (isActive: boolean) =>
  `text-sm font-medium transition-colors cursor-pointer ${
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
    seed
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
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="container-custom flex h-16 items-center justify-between">
        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-2 font-bold cursor-pointer"
        >
          <img src={logoIcon} alt={APP_INFO.LOGO_ALT} className="h-8 w-8" />
          <span className="text-xl text-foreground">{APP_INFO.NAME}</span>
        </Link>

        <nav className="hidden gap-6 md:flex items-center">
          {NAV_LINKS.map((link, index) => (
            <React.Fragment key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) => getNavLinkClasses(isActive)}
              >
                {link.label}
              </NavLink>

              {/* Insert Management after Quizzes (index 1) */}
              {index === 1 && (
                <Authorize roles="ROLE_ADMIN">
                  <NavLink
                    to={ROUTES.ADMIN.QUIZZES}
                    className={({ isActive }) => getNavLinkClasses(isActive)}
                  >
                    Management
                  </NavLink>
                </Authorize>
              )}
            </React.Fragment>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10 border p-1 cursor-pointer">
                    <AvatarImage
                      src={getUserAvatarUrl(user)}
                      alt={user?.fullName || user?.username || "User"}
                    />
                    <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <p className="text-sm font-medium leading-none">
                    {user?.fullName || user?.username || "User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground mt-1">
                    {user?.email}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  Change Password
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive cursor-pointer"
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
                className="text-sm font-medium text-foreground hover:text-primary transition-colors cursor-pointer"
              >
                Login
              </Link>
              <Button asChild>
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
