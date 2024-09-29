"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { ProductType } from "@/models/Product";
import { cn } from "@/lib/utils";

export default function ProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const [product, setProduct] = useState<ProductType | null>(null);
  const [isSale, setIsSale] = useState(false);
  useEffect(() => {
    try {
      axios.get(`/api/product?productId=${id}`).then((res) => {
        if (res.status === 200 && res.data) {
          setProduct(() => ({ ...res.data.product, id: id }));
        }
      });
    } catch (error) {
      console.log(error);
    }
  }, [id]);

  useEffect(() => {
    if (product) {
      setIsSale(product.priceInPaise > product.salePriceInPaise);
    }
  }, [product]);

  return (
    <div className="grid grid-cols-[25rem,auto]">
      {product && (
        <div className="relative size-[25rem] overflow-hidden rounded-lg">
          <div className="absolute h-full w-full animate-pulse bg-secondary-foreground/10"></div>
          <Image
            src={product.image}
            width={400}
            height={400}
            alt={product.title}
            className="absolute block h-full"
          />
        </div>
      )}
      <div className="space-y-2 p-4">
        <h1 className="text-2xl font-medium">{product?.title}</h1>
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
