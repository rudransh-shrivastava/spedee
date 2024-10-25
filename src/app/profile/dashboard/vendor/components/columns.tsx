"use client";

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
import Link from "next/link";
import Image from "next/image";

export type OrderType = {
  name: string;
  status: string;
  productId: string;
  image: string;
  quantity: number;
  pricePaid: number;
};

export const columns: ColumnDef<OrderType>[] = [
  {
    accessorKey: "productId",
    header: () => <div className="text-center">&#35; Product Id</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("productId")}</div>
    ),
  },

  {
    accessorKey: "name",
    header: "Product",
    cell: ({ row }) => (
      <Link href={`/product/${row.getValue("productId")}`}>
        <div className="group/link flex items-center gap-2">
          <div className="size-12">
            <Image
              src={row.original.image}
              width={48}
              height={48}
              alt=""
              className="size-12 object-cover"
            />
          </div>
          <span className="text-sm group-hover/link:underline">
            {row.getValue("name")}
          </span>
        </div>
      </Link>
    ),
    // <div className="">{row.getValue("name")}</div>,
  },

  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("quantity")}</div>
    ),
  },
  {
    accessorKey: "pricePaid",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="justify-center"
        title="Amount"
        column={column}
      />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("pricePaid"));
      return <div className="text-center font-medium">{amount}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
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
              onClick={() => navigator.clipboard.writeText(payment.productId)}
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
