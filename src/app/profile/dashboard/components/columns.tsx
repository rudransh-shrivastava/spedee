"use client";

import { ProductType } from "@/models/Product";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "./DataTableColumnHeader";

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
      const id = parseFloat(row.getValue("id"));
      return <div className="text-center font-medium">{id}</div>;
    },
  },

  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="justify-center"
        title="Amount"
        column={column}
      />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      return <div className="text-center font-medium">{amount}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
