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
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { queries } from "@/app/_data/queries";
import { mutations } from "@/app/_data/mutations";
import { LoadingData } from "@/components/LoadingData";

export default function Home() {
  return (
    <div>
      <HomePage />
    </div>
  );
}

function HomePage() {
  return (
    <div className="mx-auto max-w-screen-xl md:px-8">
      <div className="">
        <div
          className="h-[15rem] rounded-lg py-8"
          style={{
            backgroundImage:
              "linear-gradient(225deg, hsl(85, 100%, 50%),hsl(120, 75%, 25%))",
          }}
        >
          <div className="flex h-full flex-col gap-2 px-8">
            <div className="flex h-full flex-col justify-center gap-4 text-background dark:text-foreground">
              <span className="text-4xl">SPEDEE</span>
              <span>Delivery in 15 - 45 minutes</span>
            </div>
            <Button className="mt-auto w-max">Shop Now</Button>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-4 py-4 sm:justify-start">
        <BestSellers />
      </div>
    </div>
  );
}

function BestSellers() {
  const { status, data: bestSellers } = useQuery(queries.bestSellerProducts);
  const { status: cartQueryStatus, data: cartProducts } = useQuery(
    queries.cart
  );

  const productCartQuantity: {
    [key: string]: number;
  } = {};

  if (cartQueryStatus === "success") {
    cartProducts.forEach((cartProduct) => {
      productCartQuantity[cartProduct.product.id] = cartProduct.quantity;
    });
  }

  return (
    <LoadingData status={[status, cartQueryStatus]}>
      {bestSellers
        ? bestSellers.map((product, index) => (
            <ProductCard
              key={index}
              productCartQuantity={productCartQuantity}
              product={product}
            />
          ))
        : ""}
    </LoadingData>
  );
}

function ProductCard({
  product,
  productCartQuantity,
}: {
  product: ProductType & { id: string };
  productCartQuantity: {
    [key: string]: number;
  };
}) {
  const updateCartMutation = useMutation(mutations.updateCart);
  const [quantity, setQuantity] = useState(
    productCartQuantity[product.id] || 0
  );
  return (
    <Card className="group w-full max-w-[16rem]">
      <CardHeader className="overflow-hidden rounded-lg p-0">
        <div className="relative mx-auto size-[16rem] overflow-hidden rounded-lg rounded-b-none">
          <div className="absolute h-full w-full animate-pulse bg-secondary-foreground/10"></div>
          <Image
            src={product.image}
            alt={product.name}
            width={200}
            height={200}
            className="absolute block h-full w-full transition-transform"
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
        <div className="flex flex-wrap items-center justify-between gap-2 py-4">
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
        <Button variant="secondary" className="w-full" asChild>
          <Link href={`/product/${product.id}/checkout`}>Buy Now</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
