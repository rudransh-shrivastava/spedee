import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ProductType } from "@/models/Product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "@/components/Loader";
import { useCallback } from "react";
import { queries } from "@/app/_data/queries";
import { mutations } from "@/app/_data/mutations";

export default function Cart() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            className="fill-current"
          >
            <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h440q17 0 28.5 11.5T760-320q0 17-11.5 28.5T720-280H280q-45 0-68-39.5t-2-78.5l54-98-144-304H80q-17 0-28.5-11.5T40-840q0-17 11.5-28.5T80-880h65q11 0 21 6t15 17l27 57Zm134 280h280-280Z" />
          </svg>
          My Cart
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Cart</SheetTitle>
          <SheetDescription>Your cart</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col py-8">
          <CartContent />
        </div>
      </SheetContent>
    </Sheet>
  );
}

function CartContent() {
  const queryClient = useQueryClient();
  const { status, data: cartProducts } = useQuery(queries.cart);

  const setProductQuantity = useCallback(
    (id: string, quantity: number) => {
      queryClient.setQueryData(
        ["products", "cart"],
        cartProducts?.map((p) => (p.product.id === id ? { ...p, quantity } : p))
      );
      queryClient.invalidateQueries({
        queryKey: ["products", "cart"],
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
    <div className="flex justify-center py-12">Something Went Wrong</div>;
  }

  return cartProducts
    ? cartProducts.map(({ product, quantity }, index) => (
        <CartItemCard
          quantity={quantity}
          key={index}
          product={product}
          setProductQuantity={setProductQuantity}
        />
      ))
    : "";
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
        "flex items-center gap-2 rounded-lg border p-2",
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
