"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProductType } from "@/models/Product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { queries } from "@/app/_data/queries";
import { mutations } from "@/app/_data/mutations";
import { LoadingData } from "@/components/LoadingData";
import { Minus, Plus } from "lucide-react";
import Link from "next/link";

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

  return (
    <LoadingData status={status}>
      <div className="flex w-full flex-col">
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
      <div className="h-max border p-4 md:sticky md:top-20">
        <div className="flex justify-between py-1 text-sm font-light text-foreground/75">
          <span>Item Total</span>
          <span>
            {cartProducts
              ? cartProducts?.reduce(
                  (acc, { product, quantity }) =>
                    acc + product.priceInPaise * quantity,
                  0
                )
              : ""}
          </span>
        </div>
        <div className="flex justify-between py-1 text-sm font-light text-foreground/75">
          <span>Delivery Fee</span>
          <span>{100}</span>
        </div>
        <div className="flex justify-between py-1 text-sm font-light text-foreground/75">
          <span>Platform Fee</span>
          <span>{100}</span>
        </div>
        <div className="flex justify-between py-1 text-sm font-light text-foreground/75">
          <span>GST</span>
          <span>{100}</span>
        </div>
        <div className="mt-2 flex justify-between border-t py-2 font-bold">
          <span>Total Payable</span>
          <span>{100}</span>
        </div>
        <Button className="mt-2 w-full">Place Order</Button>
      </div>
    </LoadingData>
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
        "flex items-center gap-2 border-b py-4",
        updateCartMutation.status === "pending"
          ? "pointer-events-none opacity-50"
          : ""
      )}
    >
      <Link href={`/product/${product.id}`}>
        <div className="group/link flex items-center gap-2">
          <div className="size-12">
            <Image
              src={product.image}
              width={48}
              height={48}
              alt=""
              className="size-12 object-cover"
            />
          </div>
          <span className="text-sm group-hover/link:underline">
            {product.name}
          </span>
        </div>
      </Link>
      <div className="ml-auto flex flex-col items-center px-2">
        <span>{product.priceInPaise * quantity}</span>
        <span className="text-sm text-foreground/75 line-through">
          {product.salePriceInPaise * quantity}
        </span>
      </div>
      {quantity > 0 && (
        <div className="flex h-9 items-center overflow-hidden border bg-background">
          <Button
            className="px-1"
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
            <Minus className="size-4" />
          </Button>
          <span className="px-2">{quantity}</span>
          <Button
            className="px-1"
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
            <Plus className="size-4" />
          </Button>
        </div>
      )}
    </div>
  ) : (
    ""
  );
}
