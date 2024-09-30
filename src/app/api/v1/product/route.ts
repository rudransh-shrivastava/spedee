import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  const product = await Product.findById(productId);

  if (!product) {
    return Response.json({ message: "Product not found" }, { status: 404 });
  }

  const productWithId = {
    ...product.toObject(),
    productId: product.id.toString(),
  };

  return Response.json({ productWithId });
}
