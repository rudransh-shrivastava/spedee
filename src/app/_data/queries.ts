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

async function getAllProducts(): Promise<ProductType[]> {
  const data = await getData("api/v1/products");
  return data.products;
}

async function getFilteredProducts(query: string): Promise<ProductType[]> {
  const data = await getData(`api/v1/products${query}`);
  console.log(data);
  return data.products;
}

async function getVendorProducts(): Promise<ProductType[]> {
  const data = await getData("/api/v1/vendor/products");
  return data.products;
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

async function getLocations(query: string) {
  const data = await getData(`/api/v1/locations/search?query=${query}`);
  return data.predictions;
}

async function getLocationName(locationData: {
  placeId: string;
  latitude?: number;
  longitude?: number;
}) {
  let queryParams = "";
  if (locationData.placeId) {
    queryParams = `placeId=${locationData.placeId}`;
  } else if (locationData.latitude && locationData.longitude) {
    queryParams = `lat=${locationData.latitude}&lng=${locationData.longitude}`;
  } else {
    return "";
  }
  const data = await getData(`/api/v1/location/search?${queryParams}`);
  // TODO: message.results[0].formatted_address
  return data.message.results[0].formatted_address;
}

async function getLocationCoordinates(placeId: string) {
  const data = await getData(`/api/v1/location/search?placeId=${placeId}`);
  return data;
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
  vendorProducts: {
    queryFn: getVendorProducts,
    queryKey: ["products", "vendor"],
  },
  product: (id: string) => ({
    queryFn: () => getProduct(id),
    queryKey: ["products", id],
  }),
  allProducts: {
    queryFn: getAllProducts,
    queryKey: ["products"],
  },
  filteredProducts: (query: string) => ({
    queryFn: () => getFilteredProducts(query),
    queryKey: ["products", query],
  }),
  locations: (query: string) => ({
    queryFn: () => getLocations(query),
    queryKey: ["locations", query],
    enabled: !!query,
  }),
  locationName: (locationData: {
    placeId: string;
    latitude?: number;
    longitude?: number;
  }) => ({
    queryFn: () => getLocationName(locationData),
    queryKey: ["locationName", locationData],
  }),
  locationCoordinates: (placeId: string) => ({
    queryFn: () => getLocationCoordinates(placeId),
    queryKey: ["locationCoordinates", placeId],
  }),
};

export { queries };
