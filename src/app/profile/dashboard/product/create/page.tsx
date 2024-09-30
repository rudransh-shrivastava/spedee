"use client";

import { ProductType } from "@/models/Product";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "@/components/Loader";
import BackButton from "@/components/BackButton";
import { ProductForm } from "@/app/profile/dashboard/product/_components/ProductForm";

export default function CreateProductPage() {
  /*  
ProductType = {
  productId: string;
  title: string;
  description: string;
  priceInPaise: number;
  salePriceInPaise: number;
  attributes: Record<string, string[]>;
  image: string;
  otherImages: string[];
  vendorId: string;
  category: string;
  stock: number;
  bestSeller: boolean;
  bestSellerPriority: number;
};
  */
  const product = {
    productId: `${Math.random() * 10e10}`,
    title: "",
    description: "",
    priceInPaise: 0,
    salePriceInPaise: 0,
    attributes: {},
    image: "",
    otherImages: [],
    vendorId: "",
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
      <ProductForm productProps={product} />
    </>
  ) : (
    <div className="flex justify-center py-20">
      <Loader className="size-12" />
    </div>
  );
}
