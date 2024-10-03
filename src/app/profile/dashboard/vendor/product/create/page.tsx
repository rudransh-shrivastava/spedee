"use client";

import Loader from "@/components/Loader";
import BackButton from "@/components/BackButton";
import { ProductForm } from "@/app/profile/dashboard/vendor/product/_components/ProductForm";

export default function CreateProductPage() {
  const product = {
    productId: `${Math.random() * 10e10}`,
    name: "",
    description: "",
    priceInPaise: 0,
    salePriceInPaise: 0,
    attributes: {},
    image: "",
    otherImages: [],
    vendorEmail: "",
    category: "",
    stock: 0,
    bestSeller: false,
    bestSellerPriority: 0,
  };

  return product ? (
    <>
      <div className="flex items-center gap-2 pb-8 pt-4">
        <BackButton />
        <h1 className="text-2xl">Add a Product</h1>
      </div>
      <ProductForm submitUrl="" productProps={product} />
    </>
  ) : (
    <div className="flex justify-center py-20">
      <Loader className="size-12" />
    </div>
  );
}
