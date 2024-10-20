"use client";

import { mutations } from "@/app/_data/mutations";
import { queries } from "@/app/_data/queries";
import { LoadingData } from "@/components/LoadingData";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
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
  const productCartQuantity: {
    [key: string]: number;
  } = {};

  const queryClient = useQueryClient();
  if (cartQueryStatus === "success") {
    cartProducts.forEach((cartProduct) => {
      productCartQuantity[cartProduct.product.id] = cartProduct.quantity;
    });
  }

  const quantity = (product && productCartQuantity[product?.id]) || 0;
  const updateQuantity = useCallback(
    (quantity: number) => {
      queryClient.setQueryData(
        queries.cart.queryKey,
        cartProducts?.map((p) =>
          p.product.id === id ? { ...p, quantity } : p
        ) || [{ product, quantity }]
      );
      if (
        cartProducts &&
        !cartProducts.find((p) => p.product.id === id) &&
        quantity > 0
      ) {
        queryClient.setQueryData(queries.cart.queryKey, [
          ...cartProducts,
          { product, quantity },
        ]);
      }
    },
    [queryClient, cartProducts, product, id]
  );
  const updateCartMutation = useMutation(mutations.updateCart);
  const isSale = product && product?.priceInPaise > product?.salePriceInPaise;

  const [currentProductImage, setCurrentProductImage] = useState("");

  if (currentProductImage === "" && product && product.image !== "") {
    setCurrentProductImage(product.image);
  }

  return (
    <LoadingData status={[productStatus, cartQueryStatus]}>
      {product && (
        <div className="grid grid-cols-[34rem,auto]">
          <div className="flex gap-4">
            <div className="flex flex-col gap-2">
              <ProductImageCard
                alt={product.name}
                url={product.image}
                className={
                  product.image === currentProductImage ? "border-primary" : ""
                }
                onMouseOver={() => {
                  setCurrentProductImage(product.image);
                }}
              />
              {product &&
                product.otherImages.map((otherImage, index) => {
                  return (
                    <ProductImageCard
                      alt={product.name}
                      url={otherImage}
                      className={
                        otherImage === currentProductImage
                          ? "border-primary"
                          : ""
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
              <div className="relative size-[25rem] overflow-hidden rounded-lg">
                <div className="absolute h-full w-full animate-pulse bg-secondary-foreground/10"></div>
                <Image
                  src={currentProductImage}
                  width={400}
                  height={400}
                  alt={product.name}
                  className="absolute block"
                />
              </div>
            )}
          </div>
          <div className="space-y-2 p-4">
            <h1 className="text-2xl font-medium">{product?.name}</h1>
            {isSale && (
              <div className="text-green-500">Special Price in Sale</div>
            )}
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
            <div className="flex gap-2 py-2">
              {quantity > 0 ? (
                <div className="flex h-9 w-full items-center justify-between rounded-lg bg-primary text-background">
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
                            updateQuantity(quantity - 1);
                          },
                        }
                      );
                    }}
                  >
                    -
                  </Button>
                  <span>{quantity}</span>
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
                            updateQuantity(quantity + 1);
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
                  className="w-full"
                  onClick={() => {
                    updateCartMutation.mutate(
                      {
                        productId: product.id,
                        quantity: 1,
                      },
                      {
                        onSuccess: () => {
                          updateQuantity(1);
                        },
                      }
                    );
                  }}
                >
                  Add
                </Button>
              )}
              <Button className="w-full">Buy Now</Button>
            </div>
          </div>
        </div>
      )}
    </LoadingData>
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
        "w-32 shrink-0 overflow-hidden rounded-lg border-2 border-transparent transition-colors",
        className
      )}
      {...props}
    >
      <Image src={url} width={128} height={128} className="w-32" alt={alt} />
    </div>
  );
}
