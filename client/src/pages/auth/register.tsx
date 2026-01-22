import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DinoEgg } from "@/components/shared/DinoIcons";
import {
  CardContent,
  CardHeader,
  CardLogin,
  CardTitle,
} from "@/components/ui/card";
import { registerSchema, type RegisterFormData } from "@/validations";
import { useAuth } from "@/contexts";
import { ROUTES } from "@/config/constants";

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data);
      navigate(ROUTES.HOME);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center py-12 px-4 bg-linear-to-br from-background via-secondary/20 to-primary/10">
      <div className="mx-auto w-full max-w-2xl">
        <CardLogin className="border-2 border-primary/20 shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
                <DinoEgg size={48} className="relative text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">Join Dino Quiz</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Start your evolutionary learning journey today
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-semibold">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="Enter your first name"
                    {...register("firstName")}
                    disabled={isSubmitting}
                    className="h-11"
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <span className="text-xs">⚠️</span>
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-semibold">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Enter your last name"
                    {...register("lastName")}
                    disabled={isSubmitting}
                    className="h-11"
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <span className="text-xs">⚠️</span>
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">
                  Email Address
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-semibold">
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    {...register("username")}
                    disabled={isSubmitting}
                    className="h-11"
                  />
                  {errors.username && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <span className="text-xs">⚠️</span>
                      {errors.username.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="phoneNumber"
                    className="text-sm font-semibold"
                  >
                    Phone Number
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="Enter your phone number"
                    {...register("phoneNumber")}
                    disabled={isSubmitting}
                    className="h-11"
                  />
                  {errors.phoneNumber && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <span className="text-xs">⚠️</span>
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>
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

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-semibold"
                >
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  {...register("confirmPassword")}
                  disabled={isSubmitting}
                  className="h-11"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <span className="text-xs">⚠️</span>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="flex flex-row gap-3 w-full pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  asChild
                  disabled={isSubmitting}
                >
                  <Link to={ROUTES.HOME}>Back to Home</Link>
                </Button>
                <Button
                  type="submit"
                  className="flex-1 cursor-pointer shadow-lg shadow-primary/30"
                  disabled={isSubmitting}
                  size="lg"
                >
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </Button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <p className="mt-4 text-center text-sm">
                <span className="text-muted-foreground">
                  Already have an account?{" "}
                </span>
                <Link
                  to={ROUTES.LOGIN}
                  className="font-semibold text-primary hover:underline"
                >
                  Login now
                </Link>
              </p>
            </div>
          </CardContent>
        </CardLogin>
      </div>
    </div>
  );
}
