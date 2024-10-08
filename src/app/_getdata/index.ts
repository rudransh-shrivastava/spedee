"use client";

import { ProductType } from "@/models/Product";
import { AttributeType } from "@/types";
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
  const data = await getData("/api/v1/cart");
  return data.items;
}

async function updateCart(data: {
  productId: string;
  quantity: number;
}): Promise<{ data: { success: boolean; error: boolean; message?: string } }> {
  return axios.post("/api/v1/cart/update", { ...data });
}

async function getAttributes(): Promise<AttributeType[]> {
  return await getData("/api/v1/attributes");
}

async function createAttribute(
  attributeName: string
): Promise<{ success: boolean; message: string; attribute: AttributeType }> {
  const response = await axios.post("/api/v1/attributes/create", {
    id: "no-id",
    name: attributeName,
    values: [],
  });
  return response.data;
}

const queries = {
  getBestSellerProducts,
  updateCart,
  getCart,
  getAttributes,
  createAttribute,
};

export default queries;
