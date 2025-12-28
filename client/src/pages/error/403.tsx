import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardHeader,
  CardLogin,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import bg from "@/assets/images/bg.png";

export default function ForbiddenPage() {
  return (
    <div
      className="flex min-h-screen flex-col bg-primary justify-center px-6 py-12"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="md:mx-auto md:w-full md:max-w-md">
        <CardLogin>
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              403 Forbidden
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-6">
              You do not have permission to access this page.
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
