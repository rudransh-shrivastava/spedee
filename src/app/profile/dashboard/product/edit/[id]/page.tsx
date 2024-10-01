"use client";

import { ProductType } from "@/models/Product";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "@/components/Loader";
import BackButton from "@/components/BackButton";
import { ProductForm } from "@/app/profile/dashboard/product/_components/ProductForm";

export default function EditProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const [product, setProduct] = useState<ProductType | null>(null);

  useEffect(() => {
    try {
      axios
        .post(`/api/v1/product?productId=${id}`)
        .then((res) => {
          if (res.status === 200 && res.data && res.data.product) {
            setProduct(res.data.product);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }, [id]);

  return product ? (
    <>
      <div className="flex items-center gap-2 pb-8 pt-4">
        <BackButton />
        <h1 className="text-2xl">Edit Product</h1>
      </div>
      <ProductForm productProps={product} />
    </>
  ) : (
    <div className="flex justify-center py-20">
      <Loader className="size-12" />
    </div>
  );
}
