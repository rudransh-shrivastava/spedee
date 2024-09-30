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
    header: () => <div className="text-center">&#35;</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      return <div className="text-center font-medium">{amount}</div>;
    },
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
