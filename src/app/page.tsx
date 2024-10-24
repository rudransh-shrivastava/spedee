"use client";

import { Button } from "@/components/ui/button";
import { ProductType } from "@/models/Product";
import Image from "next/image";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { queries } from "@/app/_data/queries";
import { mutations } from "@/app/_data/mutations";
import { LoadingData } from "@/components/LoadingData";

export default function Home() {
  return <HomePage />;
}

function HomePage() {
  return (
    <>
      <div className="h-[15rem] pb-8">
        <div className="flex h-full flex-col gap-2 px-8">
          <div className="flex h-full flex-col justify-center gap-4">
            <span className="text-4xl">SPEDEE</span>
            <span>Delivery in 15 - 45 minutes</span>
          </div>
          <Button className="w-max">Shop Now</Button>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-2 py-4 sm:justify-center">
        <BestSellers />
      </div>
    </>
  );
}

function BestSellers() {
  const { status, data: bestSellers } = useQuery(queries.allProducts);
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
    <div className="group flex w-full max-w-[19rem] flex-col border p-4">
      <Link href={`/product/${product.id}`}>
        <div className="group/link overflow-hidden p-0">
          <div className="relative mx-auto flex size-[17rem] items-center justify-center overflow-hidden">
            <Image
              src={product.variants[0].image}
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
      <div className="mt-auto">
        <div className="flex flex-wrap items-center justify-between gap-2 py-4">
          <div className="flex items-center gap-2">
            <span className="font-bold">
              &#8377;{product.variants[0].salePriceInPaise}
            </span>
            <span className="text-sm text-gray-400 line-through">
              &#8377;{product.variants[0].priceInPaise}
            </span>
          </div>
          {quantity > 0 ? (
            <div className="flex h-9 min-w-16 items-center justify-between bg-primary text-background">
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
              variant="secondary"
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
      </div>
    </div>
  );
}
