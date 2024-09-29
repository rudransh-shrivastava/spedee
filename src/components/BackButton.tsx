"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <Button
      size="icon"
      variant="ghost"
      className="rounded-full"
      onClick={() => {
        router.back();
      }}
    >
      <ArrowLeft />
    </Button>
  );
}
