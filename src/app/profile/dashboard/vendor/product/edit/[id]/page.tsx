"use client";

import BackButton from "@/components/BackButton";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queries } from "@/app/_data/queries";
import { mutations } from "@/app/_data/mutations";
import { ProductForm } from "@/app/profile/dashboard/vendor/product/_components/ProductForm";
import { LoadingData } from "@/components/LoadingData";

export default function EditProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const { status, data: product } = useQuery(queries.product(id));
  const editProductMutation = useMutation(mutations.createProduct);

  return (
    <>
      <div className="flex items-center gap-2 pb-8 pt-4">
        <BackButton />
        <h1 className="text-2xl">Edit Product</h1>
      </div>
      <LoadingData status={status}>
        {product && (
          <ProductForm
            saving={editProductMutation.status === "pending"}
            onSave={() => {}}
            productProps={product}
          />
        )}
      </LoadingData>
    </>
  );
}
