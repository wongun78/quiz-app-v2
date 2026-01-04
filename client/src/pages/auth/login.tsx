import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CardContent,
  CardHeader,
  CardLogin,
  CardTitle,
} from "@/components/ui/card";
import bg from "@/assets/images/bg.jpg";
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
    <div
      className="flex min-h-screen flex-col bg-primary justify-center"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="mx-auto w-full max-w-md">
        <CardLogin>
          <CardHeader>
            <CardTitle className="text-center text-2xl">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                  disabled={isSubmitting}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex flex-row gap-2 w-full">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-none shadow-none"
                  asChild
                >
                  <Link to={ROUTES.HOME}>Back to Home</Link>
                </Button>
                <Button
                  type="submit"
                  className="flex-1 cursor-pointer"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
              </div>
            </form>

            <div className="mt-4 space-y-2">
              <p className="text-center text-sm">
                <Link
                  to="#"
                  className="font-semibold text-muted-foreground hover:underline"
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
                  className="font-semibold text-muted-foreground hover:underline"
                >
                  Register
                </Link>
              </p>
            </div>
          </CardContent>
        </CardLogin>
      </div>
    </div>
  );
}
