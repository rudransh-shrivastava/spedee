"use client";

import { useQuery } from "@tanstack/react-query";
import { queries } from "../_data/queries";
import { LoadingData } from "@/components/LoadingData";

export default function Page() {
  const { data, status } = useQuery(queries.allProducts);
  return (
    <div>
      <LoadingData status={status}></LoadingData>
    </div>
  );
}

function DataComponent({ data }: { data: unknown[] }) {
  return <div>DataComponent</div>;
}
