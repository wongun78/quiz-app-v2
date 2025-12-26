import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CardContent,
  CardHeader,
  CardLogin,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col bg-primary justify-center">
      <div className="mx-auto w-full max-w-md">
        <CardLogin>
          <CardHeader>
            <CardTitle className="text-center text-2xl">Register</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="flex flex-row gap-2">
                <div className="space-y-1 flex-1">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="Enter your first name" />
                </div>

                <div className="space-y-1 flex-1">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Enter your last name" />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>

              <div className="flex flex-row gap-2">
                <div className="space-y-1 flex-1">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" placeholder="Enter your username" />
                </div>

                <div className="space-y-1 flex-1">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="Enter your phone" />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                />
              </div>

              <div className="flex flex-row gap-2 w-full">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-none shadow-none"
                  asChild
                >
                  <Link to="/">Back to Home</Link>
                </Button>
                <Button type="submit" className="flex-1 cursor-pointer">
                  Register
                </Button>
              </div>
            </form>

            <p className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                Already have an account?{" "}
              </span>
              <Link
                to="/login"
                className="font-semibold text-muted-foreground hover:underline"
              >
                Login
              </Link>
            </p>
          </CardContent>
        </CardLogin>
      </div>
    </div>
  );
}
