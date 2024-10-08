"use client";

import { ProductType } from "@/models/Product";
import axios from "axios";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getData(url: string): Promise<any> {
  const response = await axios.get(url);
  return response.data;
}

export async function getBestSellerProducts(): Promise<ProductType[]> {
  const data = await getData("/api/v1/products/bestsellers");
  return data.products;
}

export async function updateCart(data: {
  productId: string;
  quantity: number;
}): Promise<{ success: boolean; error: boolean; message?: string }> {
  return axios.post("/api/v1/cart/update", { ...data });
}

const queries = {
  getBestSellerProducts,
  updateCart,
};

export default queries;
