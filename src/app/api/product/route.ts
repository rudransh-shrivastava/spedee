import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  await connectDB();

  const searchParams = request.nextUrl.searchParams;
  const productId = searchParams.get("productId");

  const product = await Product.findById(productId);

  return Response.json({ product });
}
