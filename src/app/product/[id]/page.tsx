"use client";

import { queries } from "@/app/_data/queries";
import { AddToCartButton } from "@/components/AddToCartButton";
import { LoadingData } from "@/components/LoadingData";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProductType, VariantType } from "@/models/Product";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

export default function ProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const { status: productStatus, data: product } = useQuery(
    queries.product(id)
  );
  const { status: cartQueryStatus, data: cartProducts } = useQuery(
    queries.cart
  );
  return (
    <LoadingData status={[productStatus, cartQueryStatus]}>
      {product && cartProducts && (
        <ProductComponent product={product} cartProducts={cartProducts} />
      )}
    </LoadingData>
  );
}

function ProductComponent({
  product,
  cartProducts,
}: {
  product: ProductType;
  cartProducts: { product: ProductType; quantity: number }[];
}) {
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

  const switchVariant = useCallback(
    (variant: VariantType) => {
      setCurrentVariant(variant);
      setCurrentProductImage(variant.image);
      updateVariantURLParams(variant);
    },
    [updateVariantURLParams]
  );

  const [currentVariant, setCurrentVariant] = useState<VariantType>(() => {
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

  const [currentProductImage, setCurrentProductImage] = useState(
    currentVariant.image
  );

  const isSale = currentVariant.priceInPaise > currentVariant.salePriceInPaise;

  return (
    <div className="grid grid-cols-[34rem,auto]">
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
          {product &&
            currentVariant.otherImages.map((otherImage, index) => {
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
        {product && (
          <div className="relative size-[25rem] overflow-hidden">
            <Image
              src={currentProductImage}
              width={500}
              height={500}
              alt={product.name}
              className="absolute block size-full object-contain object-center"
            />
          </div>
        )}
      </div>
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
              &#8377;{currentVariant.salePriceInPaise}
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
            &#8377;{currentVariant.priceInPaise}
          </span>
        </div>
        <p className="">{product?.description}</p>
        <div>
          {product.variants.length &&
            Object.keys(product.attributes).map((key, index) => (
              <div key={index}>
                <div>{key}</div>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        switchVariant(variant);
                      }}
                      className={cn(
                        "flex cursor-pointer flex-col items-center gap-1 border-2 border-transparent bg-secondary p-1 pb-0",
                        searchParams.get(key) === variant.attributes[key]
                          ? "border-primary"
                          : ""
                      )}
                    >
                      <div className="size-12">
                        <Image
                          src={product.variants[0].image}
                          width={48}
                          height={48}
                          alt=""
                          className="size-12 object-cover"
                        />
                      </div>
                      <div>{variant.attributes[key]}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>

        <div className="flex gap-2 py-2">
          <AddToCartButton product={product} className="w-full" />
          <Button className="w-full" asChild>
            <Link href={`/product/${product.id}/checkout`}>Buy Now</Link>
          </Button>
        </div>
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
  console.log(url);
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
