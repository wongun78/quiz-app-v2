import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DinoFootprint } from "@/components/shared/DinoIcons";
import {
  CardContent,
  CardHeader,
  CardLogin,
  CardTitle,
} from "@/components/ui/card";
import { loginSchema, type LoginFormData } from "@/validations";
import { useAuth } from "@/contexts";
import { ROUTES } from "@/config/constants";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const returnUrl = location.state?.returnUrl || ROUTES.HOME;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      navigate(returnUrl, { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-background via-secondary/20 to-primary/10">
      <div className="mx-auto w-full max-w-md">
        <CardLogin className="border-2 border-primary/20 shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
                <DinoFootprint size={48} className="relative text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Continue your learning journey
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  disabled={isSubmitting}
                  className="h-11"
                />
                {errors.email && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <span className="text-xs">⚠️</span>
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                  disabled={isSubmitting}
                  className="h-11"
                />
                {errors.password && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <span className="text-xs">⚠️</span>
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex flex-row gap-3 w-full pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  asChild
                >
                  <Link to={ROUTES.HOME}>Back to Home</Link>
                </Button>
                <Button
                  type="submit"
                  className="flex-1 cursor-pointer shadow-lg shadow-primary/30"
                  disabled={isSubmitting}
                  size="lg"
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
              </div>
            </form>

            <div className="mt-6 space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <p className="text-center text-sm">
                <Link
                  to="#"
                  className="font-semibold text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </p>
              <p className="text-center text-sm">
                <span className="text-muted-foreground">
                  Don't have an account?{" "}
                </span>
                <Link
                  to={ROUTES.REGISTER}
                  className="font-semibold text-primary hover:underline"
                >
                  Register now
                </Link>
              </p>
            </div>
          </CardContent>
        </CardLogin>
      </div>
    </div>
  );
}
