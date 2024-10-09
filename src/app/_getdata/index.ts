"use client";

import axios from "axios";
import { ProductType } from "@/models/Product";
import { AttributeType, CategoryTree } from "@/types";

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

async function updateAttribute(attribute: AttributeType): Promise<{
  success: boolean;
  message: string;
  error: boolean;
}> {
  const response = await axios.post("/api/v1/attributes/update", attribute);
  return response.data;
}

async function deleteAttribute(
  attributeId: string
): Promise<{ success: boolean; message: string }> {
  const response = await axios.post(
    "/api/v1/attributes/delete?id=" + attributeId
  );
  return response.data;
}

async function getCategories(): Promise<CategoryTree[]> {
  return await getData("/api/v1/categories");
}

async function createCategory({
  id,
  name,
  isParent,
  parentCategoryId,
}: {
  id: string;
  name: string;
  isParent: boolean;
  parentCategoryId: string | null;
}): Promise<{
  success: boolean;
  message: string;
  category: Omit<CategoryTree, "children">;
}> {
  const response = await axios.post("/api/v1/categories/create", {
    id,
    name,
    isParent,
    parentCategoryId,
  });
  return response.data;
}

async function deleteCategory(
  categoryId: string
): Promise<{ success: boolean; message: string }> {
  const response = await axios.post("/api/v1/categories/delete", {
    id: categoryId,
  });
  return response.data;
}

const queries = {
  getBestSellerProducts,
  updateCart,
  getCart,
  getAttributes,
  createAttribute,
  updateAttribute,
  deleteAttribute,
  getCategories,
  createCategory,
  deleteCategory,
};

export default queries;
