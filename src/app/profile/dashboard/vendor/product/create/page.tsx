"use client";

import BackButton from "@/components/BackButton";
import { ProductForm } from "@/app/profile/dashboard/vendor/product/_components/ProductForm";
import { mutations } from "@/app/_data/mutations";
import { useMutation } from "@tanstack/react-query";

export default function CreateProductPage() {
  const product = {
    id: `${Math.random() * 10e10}`,
    name: "",
    description: "",
    priceInPaise: 0,
    salePriceInPaise: 0,
    attributes: {},
    image: "",
    otherImages: [],
    category: "",
    variants: [],
    stock: 0,
    bestSeller: false,
    bestSellerPriority: 0,
  };

  const createProductMutation = useMutation(mutations.createProduct);

  return (
    <>
      <div className="flex items-center gap-2 pb-8 pt-4">
        <BackButton />
        <h1 className="text-2xl font-semibold text-secondary-foreground">
          Add a Product
        </h1>
      </div>
      <ProductForm
        saving={createProductMutation.status === "pending"}
        onSave={createProductMutation.mutate}
        productProps={product}
      />
    </>
  );
}
