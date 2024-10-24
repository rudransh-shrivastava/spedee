"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function Page() {
  const { data } = useQuery({
    queryKey: ["my-orders"],
    queryFn: async () => {
      const response = await axios.get("/api/v1/orders");
      return response.data;
    },
  });
  console.log(JSON.stringify(data || "NO ORDERS", null, 2));
  return <MyOrders />;
}

function MyOrders() {
  return "adsf";
}
