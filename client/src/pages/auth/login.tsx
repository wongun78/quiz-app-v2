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

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-primary justify-center">
      <div className="mx-auto w-full max-w-md">
        <CardLogin>
          <CardHeader>
            <CardTitle className="text-center text-2xl">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
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
                  Login
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
                  to="/register"
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
