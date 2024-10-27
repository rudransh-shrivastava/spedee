"use client";

import axios from "axios";
import { ProductType } from "@/models/Product";
import { AttributeType, CategoryTree } from "@/types";
import { CartFrontendType } from "../cart/_components/Cart";
import { ReviewType } from "@/models/Review";

export type PaginatedData<T> = {
  results: T[];
  next?: { page: 2; limit: 10 };
  previous?: { page: 2; limit: 10 };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getData(url: string): Promise<any> {
  const response = await axios.get(url);
  return response.data;
}

async function getProduct(id: string): Promise<ProductType> {
  const data = await getData(`/api/v1/product?productId=${id}`);
  return data.product;
}

async function getIsPurchased(id: string): Promise<{ purchased: boolean }> {
  const res = await getData(`/api/v1/product/purchased?productId=${id}`);
  return res;
}

async function getReviews(
  id: string,
  page?: number
): Promise<{
  data: PaginatedData<ReviewType>;
  stats: {
    totalRatings: number;
    averageRating: number;
    ratings: {
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
    };
  };
}> {
  const res = await getData(`/api/v1/reviews?productId=${id}&page=${page}`);
  return res;
}

async function getAllProducts(
  page?: number
): Promise<PaginatedData<ProductType>> {
  const response = await getData(`/api/v1/products?page=${page}`);
  return response.data;
}

async function getFilteredProducts(query: string): Promise<ProductType[]> {
  const data = await getData(`/api/v1/products${query}`);
  return data.products;
}

async function getVendorProducts({
  page,
}: {
  page?: number;
}): Promise<PaginatedData<ProductType>> {
  const response = await getData(`/api/v1/vendor/products?page=${page}`);
  return response.data;
}

async function getBestSellerProducts(): Promise<ProductType[]> {
  const data = await getData("/api/v1/products/bestsellers");
  return data.products;
}

async function getCart(): Promise<CartFrontendType[]> {
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
  vendorProducts: ({ page }: { page?: number }) => ({
    queryFn: () => getVendorProducts({ page: page }),
    queryKey: ["products", "vendor", page],
  }),
  product: (id: string) => ({
    queryFn: () => getProduct(id),
    queryKey: ["products", id],
  }),
  isPurchased: (id: string) => ({
    queryFn: () => getIsPurchased(id),
    queryKey: ["product", id, "purchased"],
  }),
  reviews: (id: string, page?: number) => ({
    queryFn: () => getReviews(id, page),
    queryKey: ["product", id, "reviews", page],
  }),
  allProducts: ({ page }: { page?: number }) => ({
    queryFn: () => getAllProducts(page),
    queryKey: ["products", page],
  }),
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
