import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-8">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl">404 Not Found</h1>
        <Button variant="outline" asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
      <p className="py-4 text-lg">
        The page you are looking for is not available
      </p>
    </div>
  );
}
