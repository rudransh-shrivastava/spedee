"use client";

import { queries } from "@/app/_data/queries";
import { AddToCartButton } from "@/components/AddToCartButton";
import { LoadingData } from "@/components/LoadingData";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ProductType, VariantType } from "@/models/Product";
import { useQuery } from "@tanstack/react-query";
import { Star, ThumbsDown, ThumbsUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function ProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const { status: productStatus, data: product } = useQuery(
    queries.product(id)
  );
  return (
    <LoadingData status={[productStatus]}>
      {product && <ProductComponent product={product} />}
    </LoadingData>
  );
}

function ProductComponent({ product }: { product: ProductType }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const updateVariantURLParams = useCallback(
    (variant: VariantType) => {
      const currentParams = new URLSearchParams(searchParams.toString());
      Object.keys(variant.attributes).forEach((key) => {
        currentParams.set(key, variant.attributes[key]);
      });
      router.push(`${pathname}?${currentParams.toString()}`);
    },
    [searchParams, pathname, router]
  );

  // const switchVariant = useCallback(
  //   (variant: VariantType) => {
  //     setCurrentVariant(variant);
  //     setCurrentProductImage(variant.image);
  //     updateVariantURLParams(variant);
  //   },
  //   [updateVariantURLParams]
  // );

  const [currentVariant, setCurrentVariant] = useState<VariantType>(
    product.variants[0]
  );

  useEffect(() => {
    setCurrentVariant(() => {
      const currentVariant = product.variants.find((variant) => {
        const attributes = variant.attributes;
        Object.keys(product.attributes).every((key) => {
          return attributes[key] === searchParams.get(key);
        });
      });
      if (currentVariant) return currentVariant;
      updateVariantURLParams(product.variants[0]);
      return product.variants[0];
    });
  }, [product, searchParams, updateVariantURLParams]);

  const [currentProductImage, setCurrentProductImage] = useState(
    currentVariant.image
  );

  return (
    <div className="grid grid-cols-[34rem,auto] gap-4">
      <div className="sticky top-24 h-max">
        <div className="flex gap-4">
          <div className="flex flex-col gap-2">
            <ProductImageCard
              alt={product.name}
              url={currentVariant.image}
              className={
                currentVariant.image === currentProductImage
                  ? "border-primary"
                  : ""
              }
              onMouseOver={() => {
                setCurrentProductImage(currentVariant.image);
              }}
            />
            {currentVariant.otherImages.map((otherImage, index) => {
              return (
                <ProductImageCard
                  alt={product.name}
                  url={otherImage}
                  className={
                    otherImage === currentProductImage ? "border-primary" : ""
                  }
                  onMouseOver={() => {
                    setCurrentProductImage(otherImage);
                  }}
                  key={index}
                />
              );
            })}
          </div>
          <div className="relative size-[25rem] overflow-hidden">
            <Image
              src={currentProductImage}
              width={500}
              height={500}
              alt={product.name}
              className="absolute block size-full object-contain object-center"
            />
          </div>
        </div>
        <div className="flex gap-2 p-8">
          <AddToCartButton product={product} className="w-full" />
          <Button className="w-full" asChild>
            <Link href={`/product/${product.id}/checkout`}>Buy Now</Link>
          </Button>
        </div>
      </div>

      <div className="space-y-2 p-4">
        <h1 className="text-3xl font-bold opacity-80">{product.name}</h1>
        <ProductPrice
          price={currentVariant.priceInPaise}
          salePrice={currentVariant.salePriceInPaise}
        />
        <p className="font-medium text-foreground/60">{product?.description}</p>
        <ProductVariants
          attributes={product.attributes}
          variants={product.variants}
        />
        <RatingsAndReviews />
      </div>
    </div>
  );
}

function ProductImageCard({
  url,
  alt,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  url: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-32 shrink-0 overflow-hidden border-2 p-3 transition-colors",
        className
      )}
      {...props}
    >
      <Image
        src={url}
        width={500}
        height={500}
        className="size-28 object-contain object-center"
        alt={alt}
      />
    </div>
  );
}

function ProductPrice({
  price,
  salePrice,
}: {
  price: number;
  salePrice: number;
}) {
  const isSale = price > salePrice;
  return (
    <>
      {isSale && <div className="text-green-500">Special Price in Sale</div>}
      <div
        className={cn(
          "flex items-end gap-2",
          isSale ? "grid-cols-[1fr,auto]" : ""
        )}
      >
        {isSale && (
          <span className="relative inline-block bg-opacity-80 text-2xl font-bold">
            &#8377;{salePrice}
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
          &#8377;{price}
        </span>
      </div>
    </>
  );
}

function ProductVariants({
  attributes,
  variants,
}: {
  attributes: Record<string, string[]>;
  variants: VariantType[];
}) {
  console.log(variants);
  return Object.keys(attributes).map((attribute, attributeIndex) => (
    <div key={attributeIndex} className="py-2">
      <div className="text-lg font-bold opacity-70">Select {attribute}</div>
      <div className="flex gap-2">
        {attributes[attribute].map((attbValue, attbValueIndex) => (
          <div
            key={attbValueIndex}
            className="flex size-16 cursor-pointer items-center justify-center rounded-full border"
          >
            {attbValue}
          </div>
        ))}
      </div>
    </div>
  ));
}

function RatingsAndReviews() {
  return (
    <div className="pt-4">
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold opacity-80">Ratings and Reviews</div>
        <Button variant="secondary">Rate</Button>
      </div>
      <div className="flex items-center p-4">
        <div className="flex w-max min-w-40 flex-col items-center gap-4 border-r-2 p-4">
          <div className="flex items-center gap-2 opacity-80">
            <span className="text-4xl">4.6</span>
            <Star fill="currentColor" className="size-8 text-primary" />
          </div>
          <span className="text-center">10,756 Ratings</span>
        </div>
        <div className="w-full">
          {[0, 0, 0, 0, 0].map((_, i) => (
            <div className="flex w-full items-center gap-2 p-1 px-4" key={i}>
              <div className="flex items-center gap-1">
                <span>{i + 1}</span>
                <Star className="size-4" />
              </div>
              <div className="w-full">
                <Progress value={10 + i * 5} className="rounded-none" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div>
          {[0, 0, 0, 0, 0].map((_, i) => (
            <div className="border-t p-4" key={i}>
              <div className="flex items-center gap-2">
                <div className="flex w-max items-center gap-1 bg-secondary px-3 py-1">
                  <span>4</span>
                  <Star className="size-4" />
                </div>
                <span className="divide-opacity-80 font-semibold">
                  Best product I have ever seen
                </span>
              </div>
              <div className="pt-2">
                Best product I have ever seen or will ever use buy it asap
              </div>
              <div className="flex items-center justify-between">
                <span className="divide-opacity-80 text-sm">
                  A random name you will not remember
                </span>
                <div>
                  <Button variant="ghost" size="icon">
                    <ThumbsUp className="size-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <ThumbsDown className="size-5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
