"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductType } from "@/models/Product";
import Image from "next/image";
import Link from "next/link";
import queries from "./_getdata";
import { useMutation, useQuery } from "@tanstack/react-query";
import Loader from "@/components/Loader";
import { useState } from "react";

export default function Home() {
  return (
    <div>
      <HomePage />
    </div>
  );
}

function HomePage() {
  return (
    <div className="mx-auto max-w-screen-xl px-8">
      <div className="py-4">
        <div
          className="h-[15rem] rounded-lg bg-[#cbff03] py-8"
          style={{
            backgroundImage:
              "linear-gradient(200deg, hsl(72, 100%, 50%),hsl(72.1, 100%, 30.2%))",
          }}
        >
          <div className="flex h-full flex-col gap-2 px-8">
            <div className="flex h-full flex-col justify-center gap-4 text-background">
              <span className="text-4xl">SPEDEE</span>
              <span>Delivery in 15 - 45 minutes</span>
            </div>
            <Button className="mt-auto w-max">Shop Now</Button>
          </div>
        </div>
      </div>
      <div className="py-4">
        <BestSellers />
      </div>
    </div>
  );
}

function BestSellers() {
  const { status, data: bestSellers } = useQuery({
    queryKey: ["products", "bestSellers"],
    queryFn: queries.getBestSellerProducts,
  });

  if (status === "pending") {
    return (
      <div className="flex justify-center py-12">
        <Loader />
      </div>
    );
  }
  if (status === "error") {
    <div className="flex justify-center py-12">Something Went Wrong</div>;
  }

  return bestSellers
    ? bestSellers.map((product, index) => (
        <ProductCard key={index} product={product} />
      ))
    : "";
}

function ProductCard({ product }: { product: ProductType & { id: string } }) {
  const updateCartMutation = useMutation({
    mutationFn: queries.updateCart,
  });
  const [quantity, setQuantity] = useState(0);
  return (
    <Card className="group max-w-[16rem]">
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
      <CardContent className="p-4 pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold">&#8377;{product.salePriceInPaise}</span>
            <span className="text-sm text-gray-400 line-through">
              &#8377;{product.priceInPaise}
            </span>
          </div>
          {quantity > 0 ? (
            <div className="flex h-9 min-w-16 items-center justify-between rounded-lg bg-primary text-background">
              <Button
                disabled={updateCartMutation.status === "pending"}
                className="px-2 text-2xl font-medium leading-none"
                onClick={() => {
                  updateCartMutation.mutate(
                    {
                      productId: product.id,
                      quantity: quantity - 1,
                    },
                    {
                      onSuccess: () => {
                        setQuantity((q) => q - 1);
                      },
                    }
                  );
                }}
              >
                -
              </Button>
              {quantity}
              <Button
                disabled={updateCartMutation.status === "pending"}
                className="px-2 text-lg font-medium leading-none"
                onClick={() => {
                  updateCartMutation.mutate(
                    {
                      productId: product.id,
                      quantity: quantity + 1,
                    },
                    {
                      onSuccess: () => {
                        setQuantity((q) => q + 1);
                      },
                    }
                  );
                }}
              >
                +
              </Button>
            </div>
          ) : (
            <Button
              disabled={updateCartMutation.status === "pending"}
              variant="outline"
              className="min-w-16"
              onClick={() => {
                updateCartMutation.mutate(
                  {
                    productId: product.id,
                    quantity: 1,
                  },
                  {
                    onSuccess: () => {
                      setQuantity(1);
                    },
                  }
                );
              }}
            >
              Add
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
