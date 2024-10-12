import { connectDB } from "@/lib/mongodb";
import { getPublicImageUrl } from "@/lib/s3";
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
  const imageUrl = getPublicImageUrl(product.image);
  const otherImagesUrls = product.otherImages.map((image) =>
    getPublicImageUrl(image)
  );
  const productObject: ProductType & { id: string } = {
    id: product.id.toString(),
    name: product.name,
    description: product.description,
    priceInPaise: product.priceInPaise,
    salePriceInPaise: product.salePriceInPaise,
    attributes: product.attributes,
    image: imageUrl,
    otherImages: otherImagesUrls,
    category: product.category,
    stock: product.stock,
    bestSeller: product.bestSeller,
    bestSellerPriority: product.bestSellerPriority,
    variants: product.variants,
  };

  return Response.json({ product: productObject });
}
