"use client";

import { ProductType } from "@/models/Product";
import axios from "axios";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getData(url: string): Promise<any> {
  const response = await axios.get(url);
  return response.data;
}

async function getBestSellerProducts(): Promise<ProductType[]> {
  const data = await getData("/api/v1/products/bestsellers");
  return data.products;
}

async function getCart(): Promise<
  { product: ProductType; quantity: number }[]
> {
  const data = await getData("/api/v1/cart/");
  return data.items;
}

async function updateCart(data: {
  productId: string;
  quantity: number;
}): Promise<{ data: { success: boolean; error: boolean; message?: string } }> {
  return axios.post("/api/v1/cart/update", { ...data });
}

const queries = {
  getBestSellerProducts,
  updateCart,
  getCart,
};

export default queries;
