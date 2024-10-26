import { connectDB } from "@/lib/mongodb";
import { paginatedResults } from "@/lib/pagination";
import { getPublicImageUrl } from "@/lib/s3";
import Product from "@/models/Product";
import { ProductType } from "@/models/Product";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") as string) || 1;
  const limit = parseInt(searchParams.get("limit") as string) || 10;

  const results = await paginatedResults(Product, page, limit);

  const products: (ProductType & { id: string })[] = results.results.map(
    (product): ProductType & { id: string } => {
      return {
        id: product.id.toString(),
        name: product.name,
        description: product.description,
        attributes: product.attributes,
        category: product.category,
        bestSeller: product.bestSeller,
        bestSellerPriority: product.bestSellerPriority,
        variants: product.variants.map((variant) => {
          return {
            id: variant.id,
            attributes: variant.attributes,
            stock: variant.stock,
            priceInPaise: variant.priceInPaise,
            salePriceInPaise: variant.salePriceInPaise,
            image: getPublicImageUrl(variant.image),
            otherImages: variant.otherImages.map(getPublicImageUrl),
          };
        }),
      };
    }
  );
  const data = { ...results, results: products };
  return Response.json({ data, success: true, error: false });
}
