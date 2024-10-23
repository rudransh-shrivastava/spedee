import { connectDB } from "@/lib/mongodb";
import { getPublicImageUrl } from "@/lib/s3";
import Product from "@/models/Product";
import { ProductType } from "@/models/Product";

export async function GET() {
  await connectDB();

  const data = await Product.find();

  const products: (ProductType & { id: string })[] = data.map(
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

  return Response.json({ products });
}
/*
returns products{} from models/Product.ts omits vendorEmail and adds id
*/
