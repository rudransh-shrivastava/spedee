"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function Page() {
  const { data: orders } = useQuery({
    queryKey: ["my-orders"],
    queryFn: async () => {
      const response = await axios.get("/api/v1/orders");
      return response.data.message;
    },
  });
  return orders && <MyOrders orders={orders} />;
}

function MyOrders({ orders }: { orders: any }) {
  return (
    <div>
      <div className="text-2xl">My Orders</div>
      <pre>
        <code>{JSON.stringify(orders || [], null, 2)}</code>
      </pre>
    </div>
  );
}
