"use client";

import { mutations } from "@/app/_data/mutations";
import { queries } from "@/app/_data/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useCallback } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Page({ params: { id } }: { params: { id: string } }) {
  return (
    <div className="grid h-full gap-4 lg:flex lg:flex-row-reverse">
      <RightPan id={id} />
      <div className="grid w-full gap-4">
        <div className="w-full border p-4">
          <h2>Address</h2>
          <div className="grid grid-cols-[20ch,auto] items-center gap-2 p-4">
            <Label>Name</Label>
            <Input />
            <Label>Phone</Label>
            <Input />
            <Label>Pincode</Label>
            <Input />
            <Label>Locality</Label>
            <Input />
            <Label>Area and Street</Label>
            <Input />
            <Label>Landmark</Label>
            <Input />
          </div>
        </div>
        <div className="w-full border p-4">
          <h2>Payment Options</h2>
          <div className="pt-4">
            <RadioGroup defaultValue="option-one">
              <Label htmlFor="option-one" asChild>
                <div className="flex items-center space-x-2 rounded-lg border p-4">
                  <RadioGroupItem value="option-one" id="option-one" />
                  <span>Phonepe UPI</span>
                </div>
              </Label>
              <Label htmlFor="option-two" asChild>
                <div className="flex items-center space-x-2 rounded-lg border p-4">
                  <RadioGroupItem value="option-two" id="option-two" />
                  <span>Nahi Pata</span>
                </div>
              </Label>
            </RadioGroup>
          </div>
          <div className="flex justify-end pt-2">
            <Button>Pay</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RightPan({ id }: { id: string }) {
  const queryClient = useQueryClient();

  const updateCartMutation = useMutation(mutations.updateCart);
  const { status: cartQueryStatus, data: cartProducts } = useQuery(
    queries.cart
  );
  const { data: product } = useQuery(queries.product(id));

  let quantity = 0;

  if (cartQueryStatus === "success") {
    const product = cartProducts.find((cartProduct) => {
      return cartProduct.product.id === id;
    });
    if (product) {
      quantity = product.quantity;
    }
  }

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

  return product ? (
    <div className="shrink-0 border p-4">
      {quantity > 0 ? (
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
      )}
      <div className="mt-4 text-sm">Coupon Code &#40;if any&#41;</div>
      <div className="flex gap-1">
        <Input /> <Button>Apply</Button>
      </div>
      <div className="mt-4">
        <div className="flex justify-between py-1 text-sm font-light text-foreground/75">
          <span>Item Total</span>
          <span>{product.salePriceInPaise * quantity}</span>
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
        <div className="mt-2 flex justify-between border-t py-1 font-medium">
          <span>Total Pay</span>
          <span>{100}</span>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}
