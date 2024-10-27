import { ProductType } from "@/models/Product";
import { Button } from "./ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queries } from "@/app/_data/queries";
import { mutations } from "@/app/_data/mutations";
import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import { CartFrontendType } from "@/app/cart/_components/Cart";

type AddToCartButtonVariants = "primary" | "outline";

export function AddToCartButton({
  product,
  variant = "primary",
  className,
  variantId,
}: {
  product: ProductType;
  variantId: string;
  variant?: AddToCartButtonVariants;
  className?: string;
}) {
  const { status: cartQueryStatus, data: cartProducts } = useQuery(
    queries.cart
  );
  return (
    <div
      className={cn(
        "",
        cartQueryStatus === "pending"
          ? "h-9 min-w-16 animate-pulse bg-secondary text-background"
          : "",
        className
      )}
    >
      {cartProducts && (
        <AddToCart
          className={className}
          product={product}
          cartProducts={cartProducts}
          variant={variant}
          variantId={variantId}
        />
      )}
    </div>
  );
}

function AddToCart({
  cartProducts,
  product,
  variantId,
  className,
  variant,
}: {
  cartProducts: CartFrontendType[];
  product: ProductType;
  variantId: string;
  variant: AddToCartButtonVariants;
  className?: string;
}) {
  const queryClient = useQueryClient();
  const productInCart = cartProducts?.find((p) => p.product.id === product.id);
  const productQuantity =
    productInCart && productInCart.variantId === variantId
      ? productInCart.quantity
      : 0;

  const updateCartMutation = useMutation(mutations.updateCart);

  const updateQuantity = useCallback(
    (cb: (q: number) => number) => {
      const productExistInCart = cartProducts?.find(
        (p) => p.product.id === product.id
      );
      if (!productExistInCart && cb(0)) {
        queryClient.setQueryData(
          queries.cart.queryKey,
          (data: { product: ProductType; quantity: number }[]) => {
            return [...data, { product, quantity: cb(0), variantId }];
          }
        );
        return;
      } else if (productExistInCart && cb(productExistInCart.quantity) <= 0) {
        queryClient.setQueryData(
          queries.cart.queryKey,
          (data: { product: ProductType; quantity: number }[]) => {
            return data.filter((p) => p.product.id !== product.id);
          }
        );
        return;
      }
      queryClient.setQueryData(
        queries.cart.queryKey,
        (data: { product: ProductType; quantity: number }[]) => {
          return data.map((p) =>
            p.product.id === product.id
              ? { ...p, quantity: cb(p.quantity), variantId }
              : p
          );
        }
      );
    },
    [queryClient, cartProducts, product]
  );

  return productQuantity > 0 ? (
    <div
      className={cn(
        "flex h-9 min-w-16 items-center justify-between",
        {
          "bg-primary text-background": variant === "primary",
          border: variant === "outline",
        },
        className
      )}
    >
      <Button
        disabled={updateCartMutation.status === "pending"}
        className="shadow-none"
        size="icon"
        variant={variant === "primary" ? "default" : "ghost"}
        onClick={() => {
          updateCartMutation.mutate(
            {
              productId: product.id,
              quantity: productQuantity - 1,
              variantId,
            },
            {
              onSuccess: () => {
                updateQuantity((q) => q - 1);
              },
            }
          );
        }}
      >
        <Minus className="size-4" />
      </Button>
      <span className="text-sm">{productQuantity}</span>
      <Button
        disabled={updateCartMutation.status === "pending"}
        className="shadow-none"
        size="icon"
        variant={variant === "primary" ? "default" : "ghost"}
        onClick={() => {
          updateCartMutation.mutate(
            {
              productId: product.id,
              quantity: productQuantity + 1,
              variantId,
            },
            {
              onSuccess: () => {
                updateQuantity((q) => q + 1);
              },
            }
          );
        }}
      >
        <Plus className="size-4" />
      </Button>
    </div>
  ) : (
    <Button
      disabled={updateCartMutation.status === "pending"}
      variant="secondary"
      className={cn("min-w-16 shadow-none", className)}
      onClick={() => {
        updateCartMutation.mutate(
          {
            productId: product.id,
            quantity: 1,
            variantId,
          },
          {
            onSuccess: () => {
              updateQuantity(() => 1);
            },
          }
        );
      }}
    >
      Add
    </Button>
  );
}
