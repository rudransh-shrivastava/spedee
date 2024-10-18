"use client";

import Loader from "@/components/Loader";
import BackButton from "@/components/BackButton";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queries } from "@/app/_data/queries";
import { mutations } from "@/app/_data/mutations";
import { ProductForm } from "@/app/profile/dashboard/vendor/product/_components/ProductForm";

export default function EditProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const { status, data: product } = useQuery(queries.product(id));
  const editProductMutation = useMutation(mutations.createProduct);

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
    <>
      <div className="flex items-center gap-2 pb-8 pt-4">
        <BackButton />
        <h1 className="text-2xl">Edit Product</h1>
      </div>
      <ProductForm
        saving={editProductMutation.status === "pending"}
        onSave={() => {}}
        productProps={product}
      />
    </>
  );
}
