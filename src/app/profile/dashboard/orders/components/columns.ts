"use client";

import { ProductType } from "@/models/Product";
import { ColumnDef } from "@tanstack/react-table";

export type OrderType = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  products: ProductType[];
};

export const columns: ColumnDef<OrderType>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
];
