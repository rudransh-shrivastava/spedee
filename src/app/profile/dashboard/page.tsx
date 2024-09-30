"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { ProductType } from "@/models/Product";
import axios from "axios";
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

export default function Page() {
  const [bestSellers, setBestSellers] = useState<ProductType[]>([]);

  useEffect(() => {
    try {
      axios.get("/api/products/bestsellers").then((res) => {
        if (res.status === 200 && res.data && res.data.length > 0) {
          setBestSellers(res.data);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div>
      <h1 className="text-2xl">Dashboard</h1>
      <Tabs defaultValue="orders" className="mt-4">
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
          <div className="flex min-h-[16rem] flex-wrap gap-4 py-4">
            <Button
              className="h-auto min-h-[24rem] w-full max-w-[16rem] flex-col gap-2 rounded-xl border bg-card text-card-foreground shadow"
              variant="ghost"
              asChild
            >
              <Link href="/profile/dashboard/product/create">
                <PlusIcon className="size-8" />
                <span>Add a Product</span>
              </Link>
            </Button>
            {bestSellers.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="orders">
          <OrdersTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProductCard({ product }: { product: ProductType }) {
  return (
    <Card className="group max-w-[16rem]">
      <CardHeader className="overflow-hidden rounded-lg p-0 pb-2">
        <div className="relative mx-auto size-[16rem] overflow-hidden rounded-lg rounded-b-none">
          <div className="absolute h-full w-full animate-pulse bg-secondary-foreground/10"></div>
          <Image
            src={product.image}
            alt={product.title}
            width={200}
            height={200}
            className="absolute block h-full w-full transition-transform group-hover:rotate-1 group-hover:scale-105"
          />
        </div>
        <CardTitle className="px-2 pt-2">
          <Link
            href={`/product/${product.productId}`}
            className="hover:underline"
          >
            {product.title}
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
      <CardFooter className="flex flex-col gap-2 p-2 pt-4">
        <Button className="w-full" asChild>
          <Link href={`/profile/dashboard/product/edit/${product.productId}`}>
            Edit
          </Link>
        </Button>
        <DeleteProductButton />
      </CardFooter>
    </Card>
  );
}

function DeleteProductButton() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="w-full" variant="destructive">
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
          <AlertDialogAction>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
