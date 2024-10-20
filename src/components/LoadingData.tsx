import { InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Loader from "./Loader";
import { cn } from "@/lib/utils";

export function LoadingData({
  status,
  className,
  children,
}: {
  status: string[];
  className?: string;
  children?: React.ReactNode;
}) {
  let computedStatus = status.some((s) => s === "error")
    ? "error"
    : status.some((s) => s === "pending")
      ? "pending"
      : "success";

  if (computedStatus === "error") {
    return (
      <div className={cn("flex w-full justify-center py-12", className)}>
        <div className="flex items-center gap-2 text-destructive">
          <InfoIcon />
          <span>Something Went Wrong</span>
          <Button
            variant="outline"
            className="border-2 text-foreground shadow-none"
            onClick={() => {
              window.location.reload();
            }}
          >
            Refresh
          </Button>
          <Button
            variant="outline"
            className="border-2 text-foreground shadow-none"
            asChild
          >
            <a href="/">Home</a>
          </Button>
        </div>
      </div>
    );
  }

  if (computedStatus === "pending") {
    return (
      <div className={cn("flex w-full justify-center py-12", className)}>
        <Loader />
      </div>
    );
  }

  return children;
}
