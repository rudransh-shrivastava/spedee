import { connectDB } from "@/lib/mongodb";
import Product, { ProductType } from "@/models/Product";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  const product = await Product.findById(productId);

  if (!product) {
    return Response.json({ message: "Product not found" }, { status: 404 });
  }

  const productObject: Omit<ProductType, "vendorEmail"> & { id: string } = {
    id: product.id.toString(),
    name: product.name,
    description: product.description,
    priceInPaise: product.priceInPaise,
    salePriceInPaise: product.salePriceInPaise,
    attributes: product.attributes,
    image: product.image,
    otherImages: product.otherImages,
    category: product.category,
    stock: product.stock,
    bestSeller: product.bestSeller,
    bestSellerPriority: product.bestSellerPriority,
    variants: product.variants,
  };

  return Response.json({ product: productObject });
}
/*
returns ProductType from models/Product.ts omits vendorEmail and adds id
*/
