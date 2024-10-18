"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductType } from "@/models/Product";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PlusIcon } from "lucide-react";
import OrdersTable from "./components/OrdersTable";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queries } from "@/app/_data/queries";
import Loader from "@/components/Loader";
import { mutations } from "@/app/_data/mutations";
import { useCallback } from "react";
import { toast } from "sonner";

export default function Page() {
  return (
    <div>
      <h1 className="mb-4 text-2xl">Dashboard</h1>
      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12,234</div>
                <p className="text-xs text-muted-foreground">
                  +19% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">17</div>
                <p className="text-xs text-muted-foreground">
                  +19% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">88</div>
                <p className="text-xs text-muted-foreground">
                  +19% from last month
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="products">
          <VendorProduts />
        </TabsContent>
        <TabsContent value="orders">
          <OrdersTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function VendorProduts() {
  const { status, data: vendorProducts } = useQuery(queries.vendorProducts);
  const deleteProductMutation = useMutation(mutations.deleteVendorProduct);
  const queryClient = useQueryClient();

  const deleteProduct = useCallback(
    async (productId: string): Promise<{ success: boolean; error: string }> => {
      return new Promise((resolve, reject) => {
        deleteProductMutation.mutate(productId, {
          onSuccess: () => {
            resolve({ success: true, error: "" });
            queryClient.setQueryData(
              queries.vendorProducts.queryKey,
              (prev: ProductType[]) =>
                prev.filter((product) => product.id !== productId)
            );
          },
          onError: () => {
            reject({ success: false, error: "Something went wrong" });
          },
        });
      });
    },
    [deleteProductMutation]
  );

  if (status === "pending") {
    return (
      <div className="flex justify-center py-12">
        <Loader />
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="flex justify-center py-12">Something Went Wrong</div>
    );
  }

  return (
    <div className="flex min-h-[16rem] flex-wrap gap-4 py-4">
      <Button
        className="h-auto min-h-[24rem] w-full max-w-[16rem] flex-col gap-2 rounded-xl border bg-card text-card-foreground shadow"
        variant="ghost"
        asChild
      >
        <Link href="/profile/dashboard/vendor/product/create">
          <PlusIcon className="size-8" />
          <span>Add a Product</span>
        </Link>
      </Button>
      {vendorProducts &&
        vendorProducts.map((product, index) => (
          <ProductCard
            key={index}
            product={product}
            deleteProduct={deleteProduct}
          />
        ))}
    </div>
  );
}

function ProductCard({
  product,
  deleteProduct,
}: {
  product: ProductType & { id: string };
  deleteProduct: (
    productId: string
  ) => Promise<{ success: boolean; error: string }>;
}) {
  return (
    <Card className="group flex max-w-[16rem] flex-col">
      <CardHeader className="overflow-hidden rounded-lg p-0 pb-2">
        <div className="relative mx-auto size-[16rem] overflow-hidden rounded-lg rounded-b-none">
          <div className="absolute h-full w-full animate-pulse bg-secondary-foreground/10"></div>
          <Image
            src={product.image}
            alt={product.name}
            width={200}
            height={200}
            className="absolute block h-full w-full transition-transform group-hover:rotate-1 group-hover:scale-105"
          />
        </div>
        <CardTitle className="px-2 pt-2">
          <Link href={`/product/${product.id}`} className="hover:underline">
            {product.name}
          </Link>
        </CardTitle>
        <CardDescription className="px-2">
          {product.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2 py-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold">&#8377;{product.salePriceInPaise}</span>
            <span className="text-sm text-gray-400 line-through">
              &#8377;{product.priceInPaise}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="mt-auto flex flex-col gap-2 p-2 pt-4">
        <Button className="w-full" asChild>
          <Link href={`/profile/dashboard/vendor/product/edit/${product.id}`}>
            Edit
          </Link>
        </Button>
        <DeleteProductButton
          productId={product.id}
          deleteProduct={deleteProduct}
        />
      </CardFooter>
    </Card>
  );
}

function DeleteProductButton({
  productId,
  deleteProduct,
}: {
  productId: string;
  deleteProduct: (
    productId: string
  ) => Promise<{ success: boolean; error: string }>;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="w-full border-destructive text-destructive hover:text-destructive"
          variant="outline"
        >
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            Product &#40;the orders and history of order will be preserved&#41;.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              toast.promise(deleteProduct(productId), {
                loading: "Loading...",
                success: () => {
                  return `Product deleted successfully`;
                },
                error: "Something went wrong",
              });
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
