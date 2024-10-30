"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { queries } from "@/app/_data/queries";
import { LoadingData } from "@/components/LoadingData";
import { ProductCard } from "./_components/ProductCard";

export default function Home() {
  return <HomePage />;
}

function HomePage() {
  return (
    <>
      <div className="relative flex max-h-[33svh] overflow-hidden">
        <Image
          alt="banner"
          className="block h-full w-full object-cover object-top"
          src="/home-banner.jpg"
          width={1920}
          height={1080}
        />
        <div className="absolute h-full pb-8">
          <div className="flex h-full flex-col gap-2 px-8">
            <div className="flex h-full flex-col justify-center gap-4 shadow-sm">
              <span className="text-4xl">SPEDEE</span>
              <span>Delivery in 15 - 45 minutes</span>
            </div>
            <Button className="w-max">Shop Now</Button>
          </div>
        </div>
      </div>
      <Products />
    </>
  );
}

function Products() {
  const { status, data: allProducts } = useQuery(
    queries.allProducts({ page: 1 })
  );
  return (
    <LoadingData status={[status]}>
      <div className="flex flex-wrap justify-center gap-2 py-4 sm:justify-center xl:justify-start">
        {allProducts
          ? allProducts.results.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))
          : ""}
      </div>
    </LoadingData>
  );
}
