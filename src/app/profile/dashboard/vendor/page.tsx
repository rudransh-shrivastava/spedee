"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductType } from "@/models/Product";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
import { mutations } from "@/app/_data/mutations";
import { useCallback } from "react";
import { toast } from "sonner";
import { LoadingData } from "@/components/LoadingData";

export default function Page() {
  return (
    <div>
      <h1 className="mb-4 text-2xl">Dashboard</h1>
      <Tabs defaultValue="orders">
        <TabsList className="shadow-none">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <div>
              <div className="pb-2">
                <div>Total Revenue</div>
              </div>
              <div>
                <div className="text-2xl font-bold">+12,234</div>
                <p className="text-xs text-muted-foreground">
                  +19% from last month
                </p>
              </div>
            </div>
            <div>
              <div className="pb-2">
                <div>Products</div>
              </div>
              <div>
                <div className="text-2xl font-bold">17</div>
                <p className="text-xs text-muted-foreground">
                  +19% from last month
                </p>
              </div>
            </div>

            <div>
              <div className="pb-2">
                <div>Sales</div>
              </div>
              <div>
                <div className="text-2xl font-bold">88</div>
                <p className="text-xs text-muted-foreground">
                  +19% from last month
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="products">
          <VendorProducts />
        </TabsContent>
        <TabsContent value="orders">
          <OrdersTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function VendorProducts() {
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
    [deleteProductMutation, queryClient]
  );

  return (
    <div className="flex min-h-[16rem] flex-wrap gap-4 py-4">
      <LoadingData status={status}>
        <Button
          className="h-auto min-h-[24rem] w-full max-w-[16rem] flex-col gap-2 bg-card text-card-foreground"
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
      </LoadingData>
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
  const variant = product.variants[0];
  return (
    <div className="group flex w-full max-w-[19rem] flex-col border border-transparent p-4 hover:border-border">
      <Link href={`/product/${product.id}`}>
        <div className="group/link overflow-hidden p-0">
          <div className="relative mx-auto flex size-[17rem] items-center justify-center overflow-hidden">
            <Image
              src={variant.image}
              alt={product.name}
              width={500}
              height={500}
              className="h-full w-full object-cover object-top group-hover/link:object-contain group-hover/link:object-center"
            />
          </div>
          <div className="pt-2 font-medium group-hover/link:underline">
            {product.name}
          </div>
        </div>
      </Link>
      <div className="flex items-center gap-2">
        <span className="font-bold">&#8377;{variant.salePriceInPaise}</span>
        <span className="text-sm text-gray-400 line-through">
          &#8377;{variant.priceInPaise}
        </span>
      </div>
      <div className="mt-auto flex flex-col gap-2 pt-4">
        <Button className="w-full" asChild>
          <Link href={`/profile/dashboard/vendor/product/edit/${product.id}`}>
            Edit
          </Link>
        </Button>
        <DeleteProductButton
          productId={product.id}
          deleteProduct={deleteProduct}
        />
      </div>
    </div>
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
