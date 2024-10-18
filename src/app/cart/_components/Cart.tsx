"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProductType } from "@/models/Product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "@/components/Loader";
import { useCallback } from "react";
import { queries } from "@/app/_data/queries";
import { mutations } from "@/app/_data/mutations";

export function Cart() {
  const queryClient = useQueryClient();
  const { status, data: cartProducts } = useQuery(queries.cart);

  const setProductQuantity = useCallback(
    (id: string, quantity: number) => {
      queryClient.setQueryData(
        queries.cart.queryKey,
        cartProducts?.map((p) => (p.product.id === id ? { ...p, quantity } : p))
      );
      queryClient.invalidateQueries({
        queryKey: queries.cart.queryKey,
        exact: true,
      });
    },
    [cartProducts, queryClient]
  );

  if (status === "pending") {
    return (
      <div className="flex justify-center py-12">
        <Loader />
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="flex justify-center py-12">Something Went Wrong</div>
    );
  }

  return (
    <div className="flex flex-col divide-y">
      {cartProducts
        ? cartProducts.map(({ product, quantity }, index) => (
            <CartItemCard
              quantity={quantity}
              key={index}
              product={product}
              setProductQuantity={setProductQuantity}
            />
          ))
        : ""}
    </div>
  );
}

function CartItemCard({
  product,
  quantity,
  setProductQuantity,
}: {
  product: ProductType;
  quantity: number;
  setProductQuantity: (id: string, quantity: number) => void;
}) {
  const updateCartMutation = useMutation(mutations.updateCart);
  return quantity > 0 ? (
    <div
      className={cn(
        "flex items-center gap-2 p-2",
        updateCartMutation.status === "pending"
          ? "pointer-events-none opacity-50"
          : ""
      )}
    >
      <div className="size-12 rounded-lg bg-secondary shadow">
        <Image
          src={product.image}
          width={48}
          height={48}
          alt=""
          className="size-12 rounded-lg"
        />
      </div>
      <span className="text-sm">{product.name}</span>
      {quantity > 0 && (
        <div className="ml-auto flex h-9 items-center overflow-hidden rounded-lg border bg-background">
          <Button
            className="rounded-r-none px-2 text-2xl font-medium leading-none"
            variant="ghost"
            disabled={updateCartMutation.status === "pending"}
            onClick={() => {
              updateCartMutation.mutate(
                {
                  productId: product.id,
                  quantity: quantity - 1,
                },
                {
                  onSuccess: (res) => {
                    if (!res.data.error) {
                      setProductQuantity(product.id, quantity - 1);
                    }
                  },
                }
              );
            }}
          >
            -
          </Button>
          <span className="px-2">{quantity}</span>
          <Button
            className="rounded-l-none px-2 text-lg font-medium leading-none"
            variant="ghost"
            disabled={updateCartMutation.status === "pending"}
            onClick={() => {
              updateCartMutation.mutate(
                {
                  productId: product.id,
                  quantity: quantity + 1,
                },
                {
                  onSuccess: (res) => {
                    if (!res.data.error) {
                      setProductQuantity(product.id, quantity + 1);
                    }
                  },
                }
              );
            }}
          >
            +
          </Button>
        </div>
      )}
      <div className="flex flex-col items-center px-2">
        <span>{product.priceInPaise * quantity}</span>
        <span className="text-sm text-secondary-foreground line-through">
          {product.salePriceInPaise * quantity}
        </span>
      </div>
    </div>
  ) : (
    ""
  );
}
