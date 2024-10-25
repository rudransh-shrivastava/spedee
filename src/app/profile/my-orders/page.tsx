"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

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

type OrderType = {
  name: string;
  status: "PENDING";
  productId: string;
  image: string;
  quantity: number;
  pricePaid: number;
};

function MyOrders({ orders }: { orders: OrderType[] }) {
  return (
    <div>
      <div className="grid grid-cols-[19rem,auto] gap-4">
        <div className="border p-4">
          <span className="font-medium">Filters</span>
          <div className="pt-4">
            <div className="flex items-center gap-2 py-2">
              <Checkbox />
              <span>Pending</span>
            </div>
            <div className="flex items-center gap-2 py-2">
              <Checkbox />
              <span>Delivered</span>
            </div>
            <div className="flex items-center gap-2 py-2">
              <Checkbox />
              <span>Cancelled</span>
            </div>
            <div className="flex items-center gap-2 py-2">
              <Checkbox />
              <span>Failed</span>
            </div>
          </div>
        </div>
        <div className="px-4">
          <div className="text-2xl">My Orders</div>
          {orders.map((order) => (
            <div className={cn("flex items-center gap-2 border-b py-4")}>
              <Link href={`/product/${order.productId}`}>
                <div className="group/link flex items-center gap-2">
                  <div className="size-12">
                    <Image
                      src={order.image}
                      width={48}
                      height={48}
                      alt=""
                      className="size-12 object-cover"
                    />
                  </div>
                  <span className="text-sm group-hover/link:underline">
                    {order.name}
                  </span>
                </div>
              </Link>
              <div className="ml-auto flex flex-col items-center px-2">
                <span>{order.pricePaid}</span>
              </div>
              <div className="px-4 font-bold opacity-80"> {order.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
