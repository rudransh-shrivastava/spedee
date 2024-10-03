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
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  return (
    <div>
      <HomePage />
    </div>
  );
}

function HomePage() {
  const [bestSellers, setBestSellers] = useState<
    (ProductType & { id: string })[]
  >([]);

  useEffect(() => {
    try {
      axios.get("/api/v1/products/bestsellers").then((res) => {
        if (
          res.status === 200 &&
          res.data.products &&
          res.data.products.length > 0
        ) {
          setBestSellers(res.data.products);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

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
      {/* <div className="py-4">
        <div className="relative flex h-[calc(3.5rem+3.5rem+3.5rem)] flex-col items-center text-4xl font-bold">
          <div className="absolute h-[3.5rem] py-2">BEST SELLERS</div>
          <div className="absolute top-[calc(3.5rem)] h-[3.5rem] py-2 opacity-75">
            BEST SELLERS
          </div>
          <div className="absolute top-[calc(3.5rem+3.5rem)] h-[calc(3.5rem)] py-2 opacity-50">
            BEST SELLERS
          </div>
        </div>
      </div> */}
      <div className="py-4">
        {bestSellers.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: ProductType & { id: string } }) {
  const [addedCount, setAddedCount] = useState(0);
  const [loadingAddedCount, setLoadingAddedCount] = useState(false);

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
          {addedCount > 0 ? (
            <div className="flex h-9 min-w-16 items-center justify-between rounded-lg bg-primary text-background">
              <Button
                disabled={loadingAddedCount}
                className="px-2 text-2xl font-medium leading-none"
                onClick={() => {
                  setLoadingAddedCount(true);
                  axios
                    .post("/api/v1/cart/edit", {
                      productId: product.id,
                      quantity: addedCount - 1,
                    })
                    .then((res) => {
                      console.log(res.data);
                      setAddedCount(addedCount - 1);
                      setLoadingAddedCount(false);
                    });
                }}
              >
                -
              </Button>
              {addedCount}
              <Button
                disabled={loadingAddedCount}
                className="px-2 text-lg font-medium leading-none"
                onClick={() => {
                  setLoadingAddedCount(true);
                  axios
                    .post("/api/v1/cart/edit", {
                      productId: product.id,
                      quantity: addedCount + 1,
                    })
                    .then((res) => {
                      console.log(res.data);
                      setAddedCount(addedCount + 1);
                      setLoadingAddedCount(false);
                    });
                }}
              >
                +
              </Button>
            </div>
          ) : (
            <Button
              disabled={loadingAddedCount}
              variant="outline"
              className="min-w-16"
              onClick={() => {
                setLoadingAddedCount(true);
                axios
                  .post("/api/v1/cart/edit", {
                    productId: product.id,
                    quantity: 1,
                  })
                  .then((res) => {
                    console.log(res.data);
                    setAddedCount(1);
                    setLoadingAddedCount(false);
                  });
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
