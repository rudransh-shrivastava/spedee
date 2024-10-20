import { cn } from "@/lib/utils";
import { InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Error({ className }: { className?: string }) {
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
