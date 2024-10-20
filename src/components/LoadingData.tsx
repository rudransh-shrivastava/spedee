import Loader from "@/components/Loader";
import { cn } from "@/lib/utils";
import { Error } from "@/components/Error";

type StatusType = "error" | "success" | "pending";

export function LoadingData({
  status,
  className,
  children,
}: {
  status: StatusType[] | StatusType;
  className?: string;
  children?: React.ReactNode;
}) {
  let computedStatus: StatusType = "pending";

  if (Array.isArray(status)) {
    if (status.every((s) => s === "success")) {
      computedStatus = "success";
    } else if (status.some((s) => s === "error")) {
      computedStatus = "error";
    } else if (status.some((s) => s === "pending")) {
      computedStatus = "pending";
    } else {
      computedStatus = "error";
    }
  } else {
    computedStatus = status;
  }

  if (computedStatus === "error") {
    return <Error className={className} />;
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
