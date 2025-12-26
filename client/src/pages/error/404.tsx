import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardHeader,
  CardLogin,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col bg-primary justify-center px-6 py-12">
      <div className="md:mx-auto md:w-full md:max-w-md">
        <CardLogin>
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              404 Not Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-6">
              The page you are looking for does not exist.
            </p>
            <Button type="button" className="w-full" asChild>
              <Link to="/">Back to Home</Link>
            </Button>
          </CardContent>
        </CardLogin>
      </div>
    </div>
  );
}
