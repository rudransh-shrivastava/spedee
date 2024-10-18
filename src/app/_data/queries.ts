"use client";

import axios from "axios";
import { ProductType } from "@/models/Product";
import { AttributeType, CategoryTree } from "@/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getData(url: string): Promise<any> {
  const response = await axios.get(url);
  return response.data;
}

async function getProduct(id: string): Promise<ProductType> {
  const data = await getData(`/api/v1/product?productId=${id}`);
  return data.product;
}

async function getBestSellerProducts(): Promise<ProductType[]> {
  const data = await getData("/api/v1/products/bestsellers");
  return data.products;
}

async function getCart(): Promise<
  { product: ProductType; quantity: number }[]
> {
  const data = await getData("/api/v1/cart");
  return data.items;
}

async function getAttributes(): Promise<AttributeType[]> {
  return await getData("/api/v1/attributes");
}

async function getCategories(): Promise<CategoryTree[]> {
  return await getData("/api/v1/categories");
}

const queries = {
  bestSellerProducts: {
    queryFn: getBestSellerProducts,
    queryKey: ["products", "bestSellers"],
  },
  cart: {
    queryFn: getCart,
    queryKey: ["products", "cart"],
  },
  attributes: {
    queryFn: getAttributes,
    queryKey: ["attributes"],
  },
  categories: {
    queryFn: getCategories,
    queryKey: ["categories"],
  },
  product: (id: string) => ({
    queryFn: () => getProduct(id),
    queryKey: ["products", id],
  }),
};

export { queries };
