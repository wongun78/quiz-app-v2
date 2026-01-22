import { Button } from "@/components/ui/button";
import { CrossedFernsWrong } from "@/components/shared/DinoIcons";
import {
  CardContent,
  CardHeader,
  CardLogin,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 bg-linear-to-br from-background via-destructive/5 to-destructive/10">
      <div className="md:mx-auto md:w-full md:max-w-md">
        <CardLogin className="border-2 border-destructive/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-destructive/20 rounded-full blur-xl"></div>
                <CrossedFernsWrong
                  size={64}
                  className="relative text-destructive"
                />
              </div>
            </div>
            <CardTitle className="text-4xl font-bold mb-2">404</CardTitle>
            <p className="text-xl font-semibold text-foreground">
              Page Not Found
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              Oops! This path leads to uncharted territory. The page you're
              looking for has gone extinct.
            </p>
            <Button
              type="button"
              className="w-full shadow-lg shadow-primary/30"
              size="lg"
              asChild
            >
              <Link to="/">Back to Home</Link>
            </Button>
          </CardContent>
        </CardLogin>
      </div>
    </div>
  );
}
