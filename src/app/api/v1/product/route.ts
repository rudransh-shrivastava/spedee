import { connectDB } from "@/lib/mongodb";
import { getPublicImageUrl } from "@/lib/s3";
import Product, { ProductType } from "@/models/Product";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  const product = await Product.findById(productId);

  if (!product) {
    return Response.json({ message: "Product not found" }, { status: 404 });
  }
  const productObject: ProductType = {
    id: product.id.toString(),
    name: product.name,
    description: product.description,
    attributes: product.attributes,
    category: product.category,
    bestSeller: product.bestSeller,
    bestSellerPriority: product.bestSellerPriority,
    variants: product.variants.map((variant) => {
      return {
        attributes: variant.attributes,
        stock: variant.stock,
        priceInPaise: variant.priceInPaise,
        salePriceInPaise: variant.salePriceInPaise,
        image: getPublicImageUrl(variant.image),
        otherImages: variant.otherImages.map(getPublicImageUrl),
      };
    }),
  };

  return Response.json({ product: productObject });
}
