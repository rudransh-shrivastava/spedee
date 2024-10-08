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

const queries = {
  getBestSellerProducts,
};

export default queries;
