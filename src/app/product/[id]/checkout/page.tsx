"use client";

import { mutations } from "@/app/_data/mutations";
import { queries } from "@/app/_data/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useCallback, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { z, ZodFormattedError } from "zod";
import { ProductType } from "@/models/Product";
import { LoadingData } from "@/components/LoadingData";

const addressZodSchema = z.object({
  address: z
    .string()
    .min(3, { message: "Address must be at least 3 characters" }),
  city: z.string().min(3, { message: "City must be at least 3 characters" }),
  state: z.string().min(3, { message: "State must be at least 3 characters" }),
  zip: z.string().min(6, { message: "Zip code must be at least 6 characters" }),
});

const zodSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 characters" }),
  shippingAddress: addressZodSchema,
  products: z.array(
    z.object({
      productId: z.string().min(1, { message: "Product ID is required" }),
      variantId: z.string().min(1, { message: "Variant ID is required" }),
      quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
      attributes: z.record(z.string()),
    })
  ),
});

export type OrderDataType = z.infer<typeof zodSchema>;
type OrderDataErrorType = ZodFormattedError<z.infer<typeof zodSchema>>;

export default function Page({ params: { id } }: { params: { id: string } }) {
  const { status: cartQueryStatus, data: cartProducts } = useQuery(
    queries.cart
  );
  const { data: product, status: productQueryStatus } = useQuery(
    queries.product(id)
  );

  return (
    <LoadingData status={[cartQueryStatus, productQueryStatus]}>
      {product && cartProducts && (
        <Checkout product={product} cartProducts={cartProducts} />
      )}
    </LoadingData>
  );
}

function Checkout({
  product,
  cartProducts,
}: {
  product: ProductType;
  cartProducts: { product: ProductType; quantity: number }[];
}) {
  const buyProductMutation = useMutation(mutations.buyProduct);
  let quantity = 0;
  const prod = cartProducts.find((cartProduct) => {
    return cartProduct.product.id === product.id;
  }) || { product, quantity: 1 };

  if (prod) {
    quantity = prod.quantity;
  }

  const [orderData, setOrderData] = useState({
    name: "",
    phone: "",
    shippingAddress: {
      address: "",
      city: "",
      state: "",
      zip: "",
    },
    products: [
      {
        productId: product.id,
        quantity: quantity || 1,
        attributes: prod.product.variants[0].attributes,
        variantId: "",
      },
    ],
  });

  const [errors, setErrors] = useState<OrderDataErrorType>({ _errors: [] });

  const placeOrder = useCallback(() => {
    const result = zodSchema.safeParse(orderData);
    if (result.success) {
      setErrors({ _errors: [] });
      console.log("Success");
      buyProductMutation.mutate(orderData, {
        onSuccess: (data: unknown) => {
          console.log(data);
        },
      });
    } else {
      setErrors(result.error.format());
      console.log(result.error.format());
      console.log(JSON.stringify(product, null, 2));
    }
  }, [buyProductMutation, orderData, product]);

  return (
    <div className="grid h-full gap-4 lg:flex lg:flex-row-reverse">
      <LeftPan
        orderData={orderData}
        setOrderData={setOrderData}
        errors={errors}
        placeOrder={placeOrder}
      />
      <RightPan
        orderData={orderData}
        product={product}
        cartProducts={cartProducts}
      />
    </div>
  );
}

function LeftPan({
  orderData,
  setOrderData,
  errors,
  placeOrder,
}: {
  orderData: OrderDataType;
  setOrderData: React.Dispatch<React.SetStateAction<OrderDataType>>;
  errors: OrderDataErrorType;
  placeOrder: () => void;
}) {
  return (
    <div className="grid w-full gap-4">
      <div className="w-full rounded-lg border p-4">
        <h2>Address</h2>
        <div className="p-4">
          <FormGroup>
            <Label>Name</Label>
            <Input
              value={orderData.name}
              onChange={(e) => {
                setOrderData((prev) => ({ ...prev, name: e.target.value }));
              }}
            />
            <FormError error={errors.name} />
          </FormGroup>
          <FormGroup>
            <Label>Phone</Label>
            <Input
              value={orderData.phone}
              onChange={(e) => {
                setOrderData((prev) => ({ ...prev, phone: e.target.value }));
              }}
            />
            <FormError error={errors.phone} />
          </FormGroup>
          <FormGroup>
            <Label>Address</Label>
            <Input
              value={orderData.shippingAddress.address}
              onChange={(e) => {
                setOrderData((prev) => ({
                  ...prev,
                  shippingAddress: {
                    ...prev.shippingAddress,
                    address: e.target.value,
                  },
                }));
              }}
            />

            <FormError error={errors.shippingAddress?.address} />
          </FormGroup>

          <FormGroup>
            <Label>Pincode</Label>
            <Input
              value={orderData.shippingAddress.zip}
              onChange={(e) => {
                setOrderData((prev) => ({
                  ...prev,
                  shippingAddress: {
                    ...prev.shippingAddress,
                    zip: e.target.value,
                  },
                }));
              }}
            />
            <FormError error={errors.shippingAddress?.zip} />
          </FormGroup>
          <FormGroup>
            <Label>City</Label>
            <Input
              value={orderData.shippingAddress.city}
              onChange={(e) => {
                setOrderData((prev) => ({
                  ...prev,
                  shippingAddress: {
                    ...prev.shippingAddress,
                    city: e.target.value,
                  },
                }));
              }}
            />
            <FormError error={errors.shippingAddress?.city} />
          </FormGroup>
          <FormGroup>
            <Label>State</Label>
            <Input
              value={orderData.shippingAddress.state}
              onChange={(e) => {
                setOrderData((prev) => ({
                  ...prev,
                  shippingAddress: {
                    ...prev.shippingAddress,
                    state: e.target.value,
                  },
                }));
              }}
            />
            <FormError error={errors.shippingAddress?.state} />
          </FormGroup>
        </div>
      </div>
      <div className="w-full rounded-lg border p-4">
        <h2>Payment Options</h2>
        <div className="pt-4">
          <RadioGroup defaultValue="option-phone-pe">
            <Label
              htmlFor="option-phone-pe"
              className="flex cursor-pointer items-center space-x-2 rounded-lg border p-4"
            >
              <RadioGroupItem value="option-phone-pe" id="option-phone-pe" />
              <span>
                Credit & Debit cards / Wallet / UPI (Powered by PhonePe)
              </span>
            </Label>
          </RadioGroup>
        </div>
        <div className="flex justify-end pt-2">
          <Button onClick={placeOrder}>Pay</Button>
        </div>
      </div>
    </div>
  );
}

function RightPan({
  orderData,
  product,
  cartProducts,
}: {
  orderData: OrderDataType;
  product: ProductType;
  cartProducts: { product: ProductType; quantity: number }[];
}) {
  const queryClient = useQueryClient();

  const updateCartMutation = useMutation(mutations.updateCart);

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
    <div className="shrink-0 rounded-lg border p-4">
      {orderData.products[0].quantity > 0 ? (
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
              src={product.variants[0].image}
              width={48}
              height={48}
              alt=""
              className="size-12 rounded-lg"
            />
          </div>
          <span className="text-sm">{product.name}</span>
          {orderData.products[0].quantity > 0 && (
            <div className="ml-auto flex h-9 items-center overflow-hidden rounded-lg border bg-background">
              <Button
                className="rounded-r-none px-2 text-2xl font-medium leading-none"
                variant="ghost"
                disabled={updateCartMutation.status === "pending"}
                onClick={() => {
                  updateCartMutation.mutate(
                    {
                      productId: product.id,
                      quantity: orderData.products[0].quantity - 1,
                    },
                    {
                      onSuccess: (res) => {
                        if (!res.data.error) {
                          setProductQuantity(
                            product.id,
                            orderData.products[0].quantity - 1
                          );
                        }
                      },
                    }
                  );
                }}
              >
                -
              </Button>
              <span className="px-2">{orderData.products[0].quantity}</span>
              <Button
                className="rounded-l-none px-2 text-lg font-medium leading-none"
                variant="ghost"
                disabled={updateCartMutation.status === "pending"}
                onClick={() => {
                  updateCartMutation.mutate(
                    {
                      productId: product.id,
                      quantity: orderData.products[0].quantity + 1,
                    },
                    {
                      onSuccess: (res) => {
                        if (!res.data.error) {
                          setProductQuantity(
                            product.id,
                            orderData.products[0].quantity + 1
                          );
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
            <span>
              {product.variants[0].priceInPaise *
                orderData.products[0].quantity}
            </span>
            <span className="text-sm text-secondary-foreground line-through">
              {product.variants[0].salePriceInPaise *
                orderData.products[0].quantity}
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
          <span>
            {product.variants[0].salePriceInPaise *
              orderData.products[0].quantity}
          </span>
        </div>
        <div className="flex justify-between py-1 text-sm font-light text-foreground/75">
          <span>Delivery Fee</span>
          <span>{100}</span>
        </div>
        <div className="mt-2 flex justify-between border-t py-1 font-medium">
          <span>Total Payable</span>
          <span>{100}</span>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}

function FormGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid items-center gap-1 py-2 md:grid-cols-[25ch,1fr] md:gap-x-4">
      {children}
    </div>
  );
}

function FormError({ error }: { error: { _errors: string[] } | undefined }) {
  return error ? (
    <div className="col-start-2 text-sm text-destructive">
      {error._errors[0]}
    </div>
  ) : (
    ""
  );
}
