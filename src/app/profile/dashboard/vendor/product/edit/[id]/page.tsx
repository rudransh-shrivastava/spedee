"use client";

import { ProductType } from "@/models/Product";
import Loader from "@/components/Loader";
import BackButton from "@/components/BackButton";
// import { ProductForm } from "@/app/profile/dashboard/vendor/product/_components/ProductForm";

export default function EditProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const product: ProductType | null = null;

  if (!id) return "No Product Found";

  return product ? (
    <>
      <div className="flex items-center gap-2 pb-8 pt-4">
        <BackButton />
        <h1 className="text-2xl">Edit Product</h1>
      </div>
      {/* <ProductForm productProps={product} submitUrl="" /> */}
    </>
  ) : (
    <div className="flex justify-center py-20">
      <Loader className="size-12" />
    </div>
  );
}
