import { Button } from "@/components/ui/button";
import { FossilLock } from "@/components/shared/DinoIcons";
import {
  CardContent,
  CardHeader,
  CardLogin,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 bg-linear-to-br from-background via-warning/5 to-warning/10">
      <div className="md:mx-auto md:w-full md:max-w-md">
        <CardLogin className="border-2 border-warning/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-warning/20 rounded-full blur-xl"></div>
                <FossilLock size={64} className="relative text-warning" />
              </div>
            </div>
            <CardTitle className="text-4xl font-bold mb-2">403</CardTitle>
            <p className="text-xl font-semibold text-foreground">
              Access Forbidden
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              This area is protected. You don't have permission to access this
              prehistoric zone.
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
