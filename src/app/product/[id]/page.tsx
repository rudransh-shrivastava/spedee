"use client";

import { queries } from "@/app/_data/queries";
import Loader from "@/components/Loader";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

export default function ProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const { status: productStatus, data: product } = useQuery(
    queries.product(id)
  );
  const isSale = product && product?.priceInPaise > product?.salePriceInPaise;

  if (productStatus === "pending") {
    return (
      <div className="flex justify-center py-12">
        <Loader />
      </div>
    );
  }
  if (productStatus === "error") {
    <div className="flex justify-center py-12">Something Went Wrong</div>;
  }

  return (
    <div className="grid grid-cols-[25rem,auto]">
      {product && (
        <div className="relative size-[25rem] overflow-hidden rounded-lg">
          <div className="absolute h-full w-full animate-pulse bg-secondary-foreground/10"></div>
          <Image
            src={product.image}
            width={400}
            height={400}
            alt={product.name}
            className="absolute block h-full"
          />
        </div>
      )}
      <div className="space-y-2 p-4">
        <h1 className="text-2xl font-medium">{product?.name}</h1>
        {isSale && <div className="text-green-500">Special Price in Sale</div>}
        <div
          className={cn(
            "flex items-end gap-2",
            isSale ? "grid-cols-[1fr,auto]" : ""
          )}
        >
          {isSale && (
            <span className="relative inline-block text-2xl font-bold">
              &#8377;{product?.salePriceInPaise}
            </span>
          )}
          <span
            className={cn(
              "relative inline-block px-1 text-2xl font-bold text-foreground",
              isSale ? "text-lg opacity-55" : ""
            )}
          >
            {isSale && (
              <span
                className={cn(
                  "absolute left-0 top-[calc(50%-1px)] block h-0.5 w-[0%] bg-current",
                  isSale ? "w-full" : ""
                )}
              ></span>
            )}
            &#8377;{product?.priceInPaise}
          </span>
        </div>
        <p className="">{product?.description}</p>
      </div>
    </div>
  );
}
