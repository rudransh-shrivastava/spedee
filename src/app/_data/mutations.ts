"use client";

import axios from "axios";
import { AttributeType, CategoryTree } from "@/types";
import { OrderDataType } from "../product/[id]/checkout/page";

async function createProduct(product: FormData) {
  const response = await axios.post("/api/v1/vendor/product/create", product);
  return response.data;
}

async function updateCart(data: {
  productId: string;
  quantity: number;
}): Promise<{ data: { success: boolean; error: boolean; message?: string } }> {
  return axios.post("/api/v1/cart/update", { ...data });
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

async function deleteVendorProduct(productId: string) {
  const response = await axios.post(
    `/api/v1/vendor/product/delete?productId=${productId}`
  );
  return response.data;
}

async function buyProduct(orderData: OrderDataType) {
  const response = await axios.post("/api/v1/order/create", orderData);
  return response.data;
}

const mutations = {
  createProduct: {
    mutationFn: createProduct,
  },
  updateCart: {
    mutationFn: updateCart,
  },
  createAttribute: {
    mutationFn: createAttribute,
  },
  updateAttribute: {
    mutationFn: updateAttribute,
  },
  deleteAttribute: {
    mutationFn: deleteAttribute,
  },
  createCategory: {
    mutationFn: createCategory,
  },
  deleteCategory: {
    mutationFn: deleteCategory,
  },
  deleteVendorProduct: {
    mutationFn: deleteVendorProduct,
  },
  buyProduct: {
    mutationFn: buyProduct,
  },
};

export { mutations };
