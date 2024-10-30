"use client";

import { Error } from "@/components/Error";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
export default function StatusPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const { data, status, isRefetching } = useQuery({
    queryKey: ["orders", id, "status"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await axios.get(
        `/api/v1/order/status?transactionId=${id}`
      );
      console.log(response);
      return response.data;
    },
  });

  const queryClient = useQueryClient();

  return (
    <div className="flex flex-col items-center gap-4 py-20">
      {status === "error" ? (
        <Error />
      ) : data ? (
        <div className="flex items-center gap-1">
          <span className="text-secondary-foreground">Status -</span>
          <div className="text-xl font-medium text-secondary-foreground">
            {isRefetching ? (
              <div className="h-6 w-20 animate-pulse bg-secondary"></div>
            ) : (
              <div>{data.message}</div>
            )}
          </div>
        </div>
      ) : (
        ""
      )}
      <Button
        disabled={isRefetching}
        variant="secondary"
        onClick={() => {
          queryClient.invalidateQueries({ queryKey: ["orders", id, "status"] });
        }}
      >
        <span className={cn({ "opacity-0": isRefetching })}>Recheck</span>
        {isRefetching && <Loader className="absolute size-6" />}
      </Button>
    </div>
  );
}
