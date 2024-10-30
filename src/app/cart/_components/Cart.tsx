"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProductType } from "@/models/Product";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queries } from "@/app/_data/queries";
import { mutations } from "@/app/_data/mutations";
import { LoadingData } from "@/components/LoadingData";
import Link from "next/link";
import { AddToCartButton } from "@/components/AddToCartButton";
import useProductPath from "@/app/product/[id]/_components/useProductPath";

export type CartFrontendType = {
  product: ProductType;
  quantity: number;
  variantId: string;
};

export function Cart() {
  const { status, data: cartProducts } = useQuery(queries.cart);
  return (
    <LoadingData status={status}>
      <div className="flex w-full flex-col">
        {cartProducts ? (
          cartProducts.length === 0 ? (
            <div className="py-10 text-center font-medium text-secondary-foreground">
              No Product in Cart
            </div>
          ) : (
            cartProducts.map(({ product, quantity, variantId }, index) => (
              <CartItemCard
                quantity={quantity}
                key={index}
                product={product}
                variantId={variantId}
              />
            ))
          )
        ) : (
          ""
        )}
      </div>
      <div className="h-max border p-4 md:sticky md:top-20">
        <div className="flex justify-between py-1 text-sm font-light text-foreground/75">
          <span>Item Total</span>
          <span>
            {cartProducts
              ? cartProducts?.reduce(
                  (acc, { product, quantity }) =>
                    acc + product.variants[0].priceInPaise * quantity,
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

function CartItemCard({ product, quantity, variantId }: CartFrontendType) {
  const updateCartMutation = useMutation(mutations.updateCart);
  const variant =
    product.variants.find((v) => v.id === variantId) || product.variants[0];
  // console.log(
  //   "variantId found of ",
  //   product.name,
  //   product.variants.find((v) => v.id === variantId)
  // );
  const productPath = useProductPath({
    id: product.id,
    variant,
  });
  return quantity > 0 ? (
    <div
      className={cn(
        "flex items-center gap-2 border-b py-4",
        updateCartMutation.status === "pending"
          ? "pointer-events-none opacity-50"
          : ""
      )}
    >
      <Link href={productPath}>
        <div className="group/link flex items-center gap-2">
          <div className="size-12">
            <Image
              src={variant.image}
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
        <span>{variant.priceInPaise * quantity}</span>
        <span className="text-sm text-foreground/75 line-through">
          {variant.salePriceInPaise * quantity}
        </span>
      </div>
      <AddToCartButton
        product={product}
        variant="outline"
        variantId={variant.id}
      />
    </div>
  ) : (
    ""
  );
}
